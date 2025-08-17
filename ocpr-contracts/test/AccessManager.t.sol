// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {PatientRegistry} from "../src/PatientRegistry.sol";
import {AuditLog} from "../src/AuditLog.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract AccessManagerTest is Test {
    AccessManager public am;
    PatientRegistry public pr;
    AuditLog public audit;

    // Test accounts
    address public owner;
    address public admin;
    address public alice;
    address public bob;

    function setUp() public {
        owner = makeAddr("owner");
        admin = makeAddr("admin");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        pr = new PatientRegistry();
        audit = new AuditLog();
        am = new AccessManager(owner, admin, audit);

        // Register Alice as patient 1
        vm.prank(alice);
        pr.registerPatient(keccak256("Alice"), keccak256("1990-01-01"));

        // Deployer (address(this)) already has DEFAULT_ADMIN_ROLE via constructor
        // Grant admin role to `admin` so we can vm.prank(admin) for restricted calls
        am.grantRole(am.DEFAULT_ADMIN_ROLE(), admin);
    }

    function testGrantAndHasAccess() public {
        vm.prank(admin);
        am.grantAccess(1, bob, am.TREAT_ROLE(), uint64(block.timestamp + 3600));
        assertTrue(am.hasAccess(1, bob, am.TREAT_ROLE()));
    }

    function testRevoke() public {
        vm.startPrank(admin);
        am.grantAccess(1, bob, am.TREAT_ROLE(), uint64(block.timestamp + 3600));
        am.revokeAccess(1, bob, am.TREAT_ROLE());
        vm.stopPrank();
        assertFalse(am.hasAccess(1, bob, am.TREAT_ROLE()));
    }

    function testGrantZeroAddressReverts() public {
        vm.prank(admin);
        vm.expectRevert(bytes("Invalid grantee"));
        am.grantAccess(1, address(0), am.TREAT_ROLE(), uint64(block.timestamp + 1));
    }

    function testInvalidExpiryReverts() public {
        vm.prank(admin);
        vm.expectRevert(bytes("Invalid expiry"));
        am.grantAccess(1, bob, am.TREAT_ROLE(), uint64(block.timestamp));
    }

    function testPausePreventsGrantRevoke() public {
        // owner pauses
        vm.prank(owner);
        am.pause();
        vm.prank(admin);
        vm.expectRevert(Pausable.EnforcedPause.selector);
        am.grantAccess(1, bob, am.TREAT_ROLE(), uint64(block.timestamp + 3600));

        vm.prank(owner);
        am.unpause();
        vm.prank(admin);
        am.grantAccess(1, bob, am.TREAT_ROLE(), uint64(block.timestamp + 3600));
        assertTrue(am.hasAccess(1, bob, am.TREAT_ROLE()));
    }
}
