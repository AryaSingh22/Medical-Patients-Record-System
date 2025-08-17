// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {RecordManager} from "../src/RecordManager.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {KeyManager} from "../src/KeyManager.sol";
import {PatientRegistry} from "../src/PatientRegistry.sol";
import {AuditLog} from "../src/AuditLog.sol";

contract E2ETest is Test {
    RecordManager public rm;
    AccessManager public am;
    KeyManager public km;
    PatientRegistry public pr;
    AuditLog public audit;
    
    address public owner;
    address public admin;
    address payable public alice;
    address payable public bob;
    uint256 public rid;
    
    function setUp() public {
        // Initialize test addresses
        alice = payable(makeAddr("alice"));
        bob = payable(makeAddr("bob"));
        
        // Use test contract as deployer/admin
        owner = address(this);
        admin = address(this);
        
        // Deploy contracts
        pr = new PatientRegistry();
        audit = new AuditLog();
        am = new AccessManager(owner, admin, audit);
        rm = new RecordManager(
            owner,
            pr,
            am,
            audit
        );
        km = new KeyManager(rm, pr);
        
        // Initialize first record ID
        rid = 1;
    }

    function testEndToEndFlow() public {
        // 1) Patient registers
        vm.prank(alice);
        pr.registerPatient(keccak256("Alice"), keccak256("1990-01-01"));
        // 2) Patient creates a record
        vm.prank(alice);
        uint256 createdRid = rm.createRecord(1, "bafyRecordCid", bytes32(uint256(0x1234)), bytes32(0));
        assertEq(createdRid, rid);
        // 3) Admin grants access to clinician for patient 1
        vm.prank(admin);
        am.grantAccess(1, bob, am.TREAT_ROLE(), uint64(block.timestamp + 1 days));
        assertTrue(am.hasAccess(1, bob, am.TREAT_ROLE()));
        // 4) Clinician retrieves record metadata
        vm.prank(bob);
        RecordManager.Record memory r = rm.getRecord(rid);
        assertTrue(r.exists);
        assertEq(r.recordId, rid);
        assertEq(r.creator, alice);
        assertEq(r.version, 1);
        assertEq(r.cid, "bafyRecordCid");
        assertEq(r.sha256sum, bytes32(uint256(0x1234)));
    }
}
