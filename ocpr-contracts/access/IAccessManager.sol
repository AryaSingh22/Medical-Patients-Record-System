// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAccessManager {
    function grant(uint256 patientId, address grantee, bytes32 role, uint64 expiry) external;
    function revoke(uint256 patientId, address grantee, bytes32 role) external;
    function hasAccess(uint256 patientId, address viewer, bytes32 role) external view returns (bool);
}
