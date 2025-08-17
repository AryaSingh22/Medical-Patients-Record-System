// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {RecordManager} from "../src/RecordManager.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {PatientRegistry} from "../src/PatientRegistry.sol";
import {AuditLog} from "../src/AuditLog.sol";

contract RecordManagerTest is Test {
    RecordManager public RECORD_MANAGER;
    AccessManager public ACCESS_MANAGER;
    PatientRegistry public PATIENT_REGISTRY;
    AuditLog public AUDIT;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);
    address owner = address(this);
    address admin = address(0xAD);

    function setUp() public {
        PATIENT_REGISTRY = new PatientRegistry();
        AUDIT = new AuditLog();
        ACCESS_MANAGER = new AccessManager(owner, admin, AUDIT);
        RECORD_MANAGER = new RecordManager(owner, PATIENT_REGISTRY, ACCESS_MANAGER, AUDIT);
        // register Alice as patient 1
        vm.prank(alice);
        PATIENT_REGISTRY.registerPatient(keccak256("Alice"), keccak256("1990-01-01"));
    }

    function testCreateRecordByOwner() public {
        vm.prank(alice);
        uint256 rid = RECORD_MANAGER.createRecord(1, "bafyCid", bytes32(uint256(1)), bytes32(0));
        assertEq(rid, 1);
        vm.prank(alice);
        RecordManager.Record memory r = RECORD_MANAGER.getRecord(rid);
        assertTrue(r.exists);
        assertEq(r.recordId, 1);
        assertEq(r.patientId, 1);
        assertEq(r.creator, alice);
        assertEq(r.version, 1);
    }

    function testCreateRecordRevertsIfNotOwner() public {
        vm.expectRevert(RecordManager.NotPatientOwner.selector);
        vm.prank(bob);
        RECORD_MANAGER.createRecord(1, "bafyCid", bytes32(uint256(1)), bytes32(0));
    }

    function testUpdateRecord() public {
        vm.prank(alice);
        uint256 rid = RECORD_MANAGER.createRecord(1, "cid1", bytes32(uint256(1)), bytes32(0));
        vm.prank(alice);
        uint256 newRid = RECORD_MANAGER.updateRecord(rid, "cid2", bytes32(uint256(2)));
        assertEq(newRid, 2);
        vm.prank(alice);
        RecordManager.Record memory r2 = RECORD_MANAGER.getRecord(newRid);
        assertEq(r2.version, 2);
    }

    function testCreateRecordInvalidInputReverts() public {
        vm.prank(alice);
        vm.expectRevert(RecordManager.InvalidInput.selector);
        RECORD_MANAGER.createRecord(1, "", bytes32(uint256(1)), bytes32(0));

        vm.prank(alice);
        vm.expectRevert(RecordManager.InvalidInput.selector);
        RECORD_MANAGER.createRecord(1, "cid", bytes32(0), bytes32(0));
    }
}
