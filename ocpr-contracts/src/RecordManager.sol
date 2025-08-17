// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessManager} from "./AccessManager.sol";
import {PatientRegistry} from "./PatientRegistry.sol";
import {AuditLog} from "./AuditLog.sol";

/**
 * @title RecordManager
 * @notice Stores metadata pointers to encrypted patient records.
 * @dev
 * - All personally identifiable information (PII) must be salted-hashed before being stored on-chain.
 * - All record contents must be encrypted off-chain prior to upload (e.g., to IPFS). Only encrypted CIDs are stored here.
 */
contract RecordManager is Ownable, Pausable {
    error ZeroAddress();
    error NotPatientOwner();
    error NoRecord();
    error InvalidInput();

    // Gas-optimized ordering: pack smaller types; keep dynamic types separate
    struct Record {
        uint256 recordId;
        uint256 patientId;
        uint256 parentRecordId; // 0 if none
        bytes32 sha256sum; // SHA-256 of encrypted blob
        address creator; // 20 bytes
        uint64 createdAt; // 8 bytes
        uint32 version;   // 4 bytes
        bool exists;      // 1 byte
        string cid;       // dynamic pointer last
    }

    event RecordCreated(
        uint256 indexed recordId,
        uint256 indexed patientId,
        string cid,
        bytes32 sha256sum,
        uint32 version,
        address indexed creator
    );
    event RecordUpdated(
        uint256 indexed newRecordId,
        uint256 indexed patientId,
        string cid,
        bytes32 sha256sum,
        uint32 version,
        uint256 parentRecordId
    );
    event AccessManagerSet(address indexed accessManager);

    uint256 private _nextRecordId = 1;
    mapping(uint256 => Record) internal records;

    AccessManager public immutable ACCESS_MANAGER;
    PatientRegistry public immutable PATIENT_REGISTRY;
    AuditLog public immutable AUDIT;

    constructor(
        address initialOwner,
        PatientRegistry pr,
        AccessManager am,
        AuditLog audit
    ) Ownable(initialOwner) {
        if (address(pr) == address(0) || address(am) == address(0) || address(audit) == address(0)) 
            revert ZeroAddress();
        PATIENT_REGISTRY = pr;
        ACCESS_MANAGER = am;
        AUDIT = audit;
    }

    modifier onlyPatientOwner(uint256 patientId) {
        if (PATIENT_REGISTRY.ownerOfPatient(patientId) != msg.sender) revert NotPatientOwner();
       _;
    }

    function createRecord(uint256 patientId, string calldata cid, bytes32 sha256sum, bytes32 /*mimeTypeHash*/ )
        external
        whenNotPaused
        onlyPatientOwner(patientId)
        returns (uint256 rid)
    {
        if (bytes(cid).length == 0 || sha256sum == bytes32(0)) revert InvalidInput();
        rid = _nextRecordId;
        unchecked {
            _nextRecordId = rid + 1;
        }
        records[rid] = Record({
            recordId: rid,
            patientId: patientId,
            sha256sum: sha256sum,
            creator: msg.sender,
            createdAt: uint64(block.timestamp),
            version: 1,
            parentRecordId: 0,
            exists: true,
            cid: cid
        });
        emit RecordCreated(rid, patientId, cid, sha256sum, 1, msg.sender);
        AUDIT.emitAudit(keccak256(abi.encode("CREATE_RECORD", rid, patientId, msg.sender, sha256sum)));
    }

    function updateRecord(uint256 recordId, string calldata newCid, bytes32 newSha256sum)
        external
        whenNotPaused
        returns (uint256 newRid)
    {
        if (bytes(newCid).length == 0 || newSha256sum == bytes32(0)) revert InvalidInput();
        Record memory r = records[recordId];
        if (!r.exists) revert NoRecord();
        if (PATIENT_REGISTRY.ownerOfPatient(r.patientId) != msg.sender) revert NotPatientOwner();
        newRid = _nextRecordId;
        unchecked {
            _nextRecordId = newRid + 1;
        }
        records[newRid] = Record({
            recordId: newRid,
            patientId: r.patientId,
            sha256sum: newSha256sum,
            creator: msg.sender,
            createdAt: uint64(block.timestamp),
            version: r.version + 1,
            parentRecordId: recordId,
            exists: true,
            cid: newCid
        });
        emit RecordUpdated(newRid, r.patientId, newCid, newSha256sum, r.version + 1, recordId);
        AUDIT.emitAudit(keccak256(abi.encode("UPDATE_RECORD", newRid, r.patientId, msg.sender, newSha256sum, recordId)));
    }

    function getRecord(uint256 recordId) external view returns (Record memory) {
        Record memory r = records[recordId];
        if (!r.exists) revert NoRecord();
        // Allow owner or users with TREAT_ROLE
        if (PATIENT_REGISTRY.ownerOfPatient(r.patientId) != msg.sender) {
            bool ok = ACCESS_MANAGER.hasAccess(r.patientId, msg.sender, ACCESS_MANAGER.TREAT_ROLE());
            if (!ok) revert NotPatientOwner();
        }
        return r;
    }

    /// @notice Pause mutations.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause mutations.
    function unpause() external onlyOwner {
        _unpause();
    }
}
