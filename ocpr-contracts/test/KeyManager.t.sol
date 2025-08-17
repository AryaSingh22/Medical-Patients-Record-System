// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PatientRegistry} from "../src/PatientRegistry.sol";
import {RecordManager} from "../src/RecordManager.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {KeyManager} from "../src/KeyManager.sol";
import {AuditLog} from "../src/AuditLog.sol";

contract KeyManagerTest is Test {
    PatientRegistry pr;
    RecordManager rm;
    AccessManager am;
    KeyManager km;
    AuditLog audit;

    address owner = address(this);
    address admin = address(0xAD);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        pr = new PatientRegistry();
        audit = new AuditLog();
        am = new AccessManager(owner, admin, audit);
        rm = new RecordManager(owner, pr, am, audit);
        km = new KeyManager(rm, pr);

        // Register Alice as patient 1 and create a record
        vm.prank(alice);
        pr.registerPatient(keccak256("Alice"), keccak256("1990-01-01"));
        vm.prank(alice);
        rm.createRecord(1, "bafyCid", bytes32(uint256(1)), bytes32(0));
    }

    function testOnlyPatientOwnerCanSetKeyPointer() public {
        // Bob is not owner of patient 1
        vm.prank(bob);
        vm.expectRevert(KeyManager.NotPatientOwner.selector);
        km.setKeyPointer(1, bob, "bafyKey");

        // Alice (owner) can set key pointer
        vm.prank(alice);
        km.setKeyPointer(1, bob, "bafyKey");
        assertEq(km.getKeyPointer(1, bob), "bafyKey");
    }

    function testZeroAddressReverts() public {
        vm.prank(alice);
        vm.expectRevert(KeyManager.ZeroAddress.selector);
        km.setKeyPointer(1, address(0), "bafyKey");
    }
}
