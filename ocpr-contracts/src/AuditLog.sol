// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Placeholder contract for future compact hash-based audit entries.
contract AuditLog {
    event Audit(bytes32 indexed actionHash, address indexed actor, uint64 ts);

    function emitAudit(bytes32 actionHash) external {
        emit Audit(actionHash, msg.sender, uint64(block.timestamp));
    }
}
