// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IAccessManager} from "../access/IAccessManager.sol";
import {AuditLog} from "./AuditLog.sol";

/// @title AccessManager
/// @notice Patient-scoped role-based access control with expiry for medical records.
contract AccessManager is Ownable, AccessControl, Pausable, IAccessManager {
    // Errors
    error ZeroAddress();
    error InvalidRole();
    error InvalidExpiry();

    // Roles
    bytes32 public constant TREAT_ROLE = keccak256("TREAT");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Optional integration variable (not required for checks but kept for integration visibility)
    address public recordManager;

    // Audit log sink
    AuditLog public immutable AUDIT;

    // patientId => user => role => expiry
    mapping(uint256 => mapping(address => mapping(bytes32 => uint64))) public accessExpiry;

    // Events
    event AccessGranted(uint256 indexed patientId, address indexed user, bytes32 indexed role, uint64 expiry);
    event AccessRevoked(uint256 indexed patientId, address indexed user, bytes32 indexed role);
    event RecordManagerChanged(address indexed newRecordManager);

    constructor(
        address initialOwner,
        address admin,
        AuditLog audit
    ) Ownable(initialOwner) {
        if (admin == address(0)) revert ZeroAddress();
        if (address(audit) == address(0)) revert ZeroAddress();
        AUDIT = audit;
        // Grant roles to deployer (msg.sender)
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /// @notice Set associated RecordManager address (optional wiring) and emit event.
    function setRecordManager(address newRecordManager) external onlyOwner {
        if (newRecordManager == address(0)) revert ZeroAddress();
        recordManager = newRecordManager;
        emit RecordManagerChanged(newRecordManager);
    }

    /// @inheritdoc IAccessManager
    function grant(
        uint256 patientId,
        address user,
        bytes32 role,
        uint64 expiry
    ) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        if (expiry <= block.timestamp) revert InvalidExpiry();
        accessExpiry[patientId][user][role] = expiry;
        emit AccessGranted(patientId, user, role, expiry);
        AUDIT.emitAudit(keccak256(abi.encode("GRANT", patientId, user, role, expiry)));
    }

    /// @inheritdoc IAccessManager
    function revoke(
        uint256 patientId,
        address user,
        bytes32 role
    ) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        if (user == address(0)) revert ZeroAddress();
        delete accessExpiry[patientId][user][role];
        emit AccessRevoked(patientId, user, role);
        AUDIT.emitAudit(keccak256(abi.encode("REVOKE", patientId, user, role)));
    }

    /// @notice Grant access using a function name expected by some tests.
    /// @dev Mirrors grant() but uses require statements with messages to satisfy revert string expectations.
    function grantAccess(
        uint256 patientId,
        address grantee,
        bytes32 role,
        uint64 expiry
    ) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(grantee != address(0), "Invalid grantee");
        require(expiry > block.timestamp, "Invalid expiry");
        accessExpiry[patientId][grantee][role] = expiry;
        emit AccessGranted(patientId, grantee, role, expiry);
        AUDIT.emitAudit(keccak256(abi.encode("GRANT", patientId, grantee, role, expiry)));
    }

    /// @notice Revoke access using a function name expected by some tests.
    /// @dev Mirrors revoke() but uses require for zero address to satisfy revert string expectations.
    function revokeAccess(
        uint256 patientId,
        address grantee,
        bytes32 role
    ) external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(grantee != address(0), "Invalid grantee");
        delete accessExpiry[patientId][grantee][role];
        emit AccessRevoked(patientId, grantee, role);
        AUDIT.emitAudit(keccak256(abi.encode("REVOKE", patientId, grantee, role)));
    }

    /// @inheritdoc IAccessManager
    function hasAccess(
        uint256 patientId,
        address viewer,
        bytes32 role
    ) public view returns (bool) {
        uint64 expiry = accessExpiry[patientId][viewer][role];
        return expiry > uint64(block.timestamp);
    }

    /// @notice Pause access control mutations.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause access control mutations.
    function unpause() external onlyOwner {
        _unpause();
    }
}
