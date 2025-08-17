export const recordManagerAbi = [
  { "type":"constructor", "inputs":[{"type":"address","name":"owner_"},{"type":"address","name":"pr"},{"type":"address","name":"am"}], "stateMutability":"nonpayable" },
  { "type":"event", "name":"RecordCreated", "inputs":[
    {"name":"recordId","type":"uint256","indexed":true},
    {"name":"patientId","type":"uint256","indexed":true},
    {"name":"cid","type":"string","indexed":false},
    {"name":"sha256sum","type":"bytes32","indexed":false},
    {"name":"version","type":"uint32","indexed":false},
    {"name":"creator","type":"address","indexed":false}
  ], "anonymous":false },
  { "type":"function", "name":"createRecord", "stateMutability":"nonpayable", "inputs":[
    {"name":"patientId","type":"uint256"},
    {"name":"cid","type":"string"},
    {"name":"sha256sum","type":"bytes32"},
    {"name":"mimeTypeHash","type":"bytes32"}
  ], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"updateRecord", "stateMutability":"nonpayable", "inputs":[
    {"name":"recordId","type":"uint256"},
    {"name":"newCid","type":"string"},
    {"name":"newSha256sum","type":"bytes32"}
  ], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"records", "stateMutability":"view", "inputs":[
    {"name":"","type":"uint256"}
  ], "outputs":[
    {"name":"recordId","type":"uint256"},
    {"name":"patientId","type":"uint256"},
    {"name":"creator","type":"address"},
    {"name":"cid","type":"string"},
    {"name":"sha256sum","type":"bytes32"},
    {"name":"createdAt","type":"uint64"},
    {"name":"version","type":"uint32"},
    {"name":"parentRecordId","type":"uint256"},
    {"name":"exists","type":"bool"}
  ] }
] as const;
