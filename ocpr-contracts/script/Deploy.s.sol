// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {RecordManager} from "../src/RecordManager.sol";
import {AccessManager} from "../src/AccessManager.sol";
import {KeyManager} from "../src/KeyManager.sol";
import {PatientRegistry} from "../src/PatientRegistry.sol";
import {AuditLog} from "../src/AuditLog.sol";

contract Deploy is Script {
    function run() external {
        // Load deployment key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy in order
        PatientRegistry pr = new PatientRegistry();
        AuditLog audit = new AuditLog();

        AccessManager am = new AccessManager(
            deployer,    // owner
            deployer,    // admin
            audit        // audit log
        );
        
        RecordManager rm = new RecordManager(
            deployer,    // owner
            pr,          // PatientRegistry instance
            am,          // AccessManager instance
            audit        // audit log
        );
        
        KeyManager km = new KeyManager(rm, pr);

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("PatientRegistry:", address(pr));
        console.log("AccessManager:", address(am));
        console.log("RecordManager:", address(rm));
        console.log("KeyManager:", address(km));
        console.log("AuditLog:", address(audit));
    }
}
