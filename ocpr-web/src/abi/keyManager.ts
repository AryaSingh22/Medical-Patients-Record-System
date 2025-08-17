export const keyManagerAbi = [
  { "type":"constructor", "inputs":[{"type":"address","name":"rm"},{"type":"address","name":"pr"}], "stateMutability":"nonpayable" },
  { "type":"event", "name":"KeyPointerSet", "inputs":[
    {"name":"recordId","type":"uint256","indexed":true},
    {"name":"grantee","type":"address","indexed":true},
    {"name":"keyBlobCid","type":"string","indexed":false}
  ], "anonymous":false },
  { "type":"function", "name":"setKeyPointer", "stateMutability":"nonpayable", "inputs":[{"name":"recordId","type":"uint256"},{"name":"grantee","type":"address"},{"name":"keyBlobCid","type":"string"}], "outputs":[] },
  { "type":"function", "name":"getKeyPointer", "stateMutability":"view", "inputs":[{"name":"recordId","type":"uint256"},{"name":"grantee","type":"address"}], "outputs":[{"type":"string"}] }
] as const;
