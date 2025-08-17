export const accessManagerAbi = [
  { "type":"constructor", "inputs":[{"type":"address","name":"owner_"},{"type":"address","name":"rm"},{"type":"address","name":"pr"}], "stateMutability":"nonpayable" },
  { "type":"event", "name":"AccessGranted", "inputs":[
    {"name":"recordId","type":"uint256","indexed":true},
    {"name":"grantee","type":"address","indexed":true},
    {"name":"purposeCode","type":"bytes32","indexed":false},
    {"name":"expiry","type":"uint64","indexed":false}
  ], "anonymous":false },
  { "type":"event", "name":"AccessRevoked", "inputs":[
    {"name":"recordId","type":"uint256","indexed":true},
    {"name":"grantee","type":"address","indexed":true}
  ], "anonymous":false },
  { "type":"function", "name":"grant", "stateMutability":"nonpayable", "inputs":[{"name":"recordId","type":"uint256"},{"name":"grantee","type":"address"},{"name":"purposeCode","type":"bytes32"},{"name":"expiry","type":"uint64"}], "outputs":[] },
  { "type":"function", "name":"revoke", "stateMutability":"nonpayable", "inputs":[{"name":"recordId","type":"uint256"},{"name":"grantee","type":"address"}], "outputs":[] },
  { "type":"function", "name":"hasAccess", "stateMutability":"view", "inputs":[{"name":"recordId","type":"uint256"},{"name":"viewer","type":"address"}], "outputs":[{"type":"bool"}] }
] as const;
