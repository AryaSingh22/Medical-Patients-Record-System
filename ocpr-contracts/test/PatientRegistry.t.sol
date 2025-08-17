// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PatientRegistry} from "../src/PatientRegistry.sol";

contract PatientRegistryTest is Test {
    PatientRegistry pr;
    address alice = address(0xA11CE);

    function setUp() public {
        pr = new PatientRegistry();
    }

    function testRegisterAndLinkDid() public {
        vm.prank(alice);
        uint256 pid = pr.registerPatient(keccak256("Alice"), keccak256("1990-01-01"));
        assertEq(pid, 1);
        assertTrue(pr.isRegistered(alice));

        vm.prank(alice);
        pr.linkDid("did:ethr:0xAlice");
        PatientRegistry.Patient memory p = pr.getPatient(alice);
        assertEq(p.did, "did:ethr:0xAlice");
        assertEq(pr.ownerOfPatient(1), alice);
    }
}
