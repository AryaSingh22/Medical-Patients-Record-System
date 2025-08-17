// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {RecordManager} from "./RecordManager.sol";
import {PatientRegistry} from "./PatientRegistry.sol";

/// @title KeyManager
/// @notice Stores pointers to encrypted per-viewer keys for a patient.
contract KeyManager {
    error ZeroAddress();
    error NotPatientOwner();

    RecordManager public immutable RECORD_MANAGER;
    PatientRegistry public immutable PATIENT_REGISTRY;

    // patientId => viewer => key CID (encrypted)
    mapping(uint256 => mapping(address => string)) private _keyPointers;

    constructor(RecordManager rm, PatientRegistry pr) {
        if (address(rm) == address(0) || address(pr) == address(0)) revert ZeroAddress();
        RECORD_MANAGER = rm;
        PATIENT_REGISTRY = pr;
    }

    /// @notice Set a key pointer for a viewer. Only patient owner may call.
    function setKeyPointer(uint256 patientId, address viewer, string calldata keyCid) external {
        if (viewer == address(0)) revert ZeroAddress();
        if (PATIENT_REGISTRY.ownerOfPatient(patientId) != msg.sender) revert NotPatientOwner();
        _keyPointers[patientId][viewer] = keyCid;
    }

    /// @notice Get the key pointer for a viewer under a patient.
    function getKeyPointer(uint256 patientId, address viewer) external view returns (string memory) {
        return _keyPointers[patientId][viewer];
    }
}
