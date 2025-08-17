// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PatientRegistry
 * @notice Registers patients and links wallet ownership to patient IDs.
 * @dev
 * - All personally identifiable information (PII) must be salted-hashed before being stored on-chain.
 * - Any off-chain patient data stored alongside on-chain references must be encrypted prior to upload.
 */
contract PatientRegistry is Ownable {
    error AlreadyRegistered();
    error NotRegistered();
    error NoSuchPatient();
    error InvalidInput();

    // Gas-friendly ordering. Dynamic string last.
    struct Patient {
        uint256 patientId;
        bytes32 nameHash;
        bytes32 dobHash;
        address owner;
        uint64 createdAt;
        bool exists;
        string did; // did:ethr:...
    }

    event PatientRegistered(address indexed owner, uint256 indexed patientId, bytes32 nameHash, bytes32 dobHash);
    event DIDLinked(address indexed owner, string did);

    uint256 private _nextId = 1;
    mapping(address => Patient) private _patients;
    mapping(uint256 => address) private _patientIdToOwner;

    constructor() Ownable(msg.sender) {}

    /// @notice Check if a wallet is registered as a patient.
    function isRegistered(address user) external view returns (bool) {
        return _patients[user].exists;
    }

    /// @notice Get patient by owner address.
    function getPatient(address user) external view returns (Patient memory) {
        if (!_patients[user].exists) revert NotRegistered();
        return _patients[user];
    }

    /// @notice Get patient by id.
    function getPatientById(uint256 patientId) external view returns (Patient memory) {
        address owner_ = _patientIdToOwner[patientId];
        if (owner_ == address(0)) revert NoSuchPatient();
        return _patients[owner_];
    }

    /// @notice Owner address of a patient id.
    function ownerOfPatient(uint256 patientId) external view returns (address) {
        return _patientIdToOwner[patientId];
    }

    /// @notice Register caller as a new patient.
    function registerPatient(bytes32 nameHash, bytes32 dobHash) external returns (uint256 pid) {
        if (_patients[msg.sender].exists) revert AlreadyRegistered();
        if (nameHash == bytes32(0) || dobHash == bytes32(0)) revert InvalidInput();
        pid = _nextId++;
        _patients[msg.sender] = Patient({
            patientId: pid,
            nameHash: nameHash,
            dobHash: dobHash,
            owner: msg.sender,
            createdAt: uint64(block.timestamp),
            exists: true,
            did: ""
        });
        _patientIdToOwner[pid] = msg.sender;
        emit PatientRegistered(msg.sender, pid, nameHash, dobHash);
    }

    /// @notice Link a DID to the caller's patient profile.
    function linkDid(string calldata did) external {
        if (!_patients[msg.sender].exists) revert NotRegistered();
        // Optional basic length guard to prevent excessively long strings
        if (bytes(did).length == 0 || bytes(did).length > 200) revert InvalidInput();
        _patients[msg.sender].did = did;
        emit DIDLinked(msg.sender, did);
    }
}
