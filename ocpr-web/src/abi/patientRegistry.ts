export const patientRegistryAbi = [
  { "type":"constructor", "inputs":[], "stateMutability":"nonpayable" },
  { "type":"event", "name":"PatientRegistered", "inputs":[
    {"name":"owner","type":"address","indexed":true},
    {"name":"patientId","type":"uint256","indexed":true},
    {"name":"nameHash","type":"bytes32","indexed":false},
    {"name":"dobHash","type":"bytes32","indexed":false}
  ], "anonymous":false },
  { "type":"event", "name":"DIDLinked", "inputs":[
    {"name":"owner","type":"address","indexed":true},
    {"name":"did","type":"string","indexed":false}
  ], "anonymous":false },
  { "type":"function", "name":"isRegistered", "stateMutability":"view", "inputs":[{"name":"user","type":"address"}], "outputs":[{"type":"bool"}] },
  { "type":"function", "name":"getPatient", "stateMutability":"view", "inputs":[{"name":"user","type":"address"}], "outputs":[{"components":[
    {"name":"patientId","type":"uint256"},
    {"name":"owner","type":"address"},
    {"name":"nameHash","type":"bytes32"},
    {"name":"dobHash","type":"bytes32"},
    {"name":"did","type":"string"},
    {"name":"createdAt","type":"uint64"},
    {"name":"exists","type":"bool"}
  ], "type":"tuple"}] },
  { "type":"function", "name":"getPatientById", "stateMutability":"view", "inputs":[{"name":"patientId","type":"uint256"}], "outputs":[{"components":[
    {"name":"patientId","type":"uint256"},
    {"name":"owner","type":"address"},
    {"name":"nameHash","type":"bytes32"},
    {"name":"dobHash","type":"bytes32"},
    {"name":"did","type":"string"},
    {"name":"createdAt","type":"uint64"},
    {"name":"exists","type":"bool"}
  ], "type":"tuple"}] },
  { "type":"function", "name":"ownerOfPatient", "stateMutability":"view", "inputs":[{"name":"patientId","type":"uint256"}], "outputs":[{"type":"address"}] },
  { "type":"function", "name":"registerPatient", "stateMutability":"nonpayable", "inputs":[{"name":"nameHash","type":"bytes32"},{"name":"dobHash","type":"bytes32"}], "outputs":[{"type":"uint256"}] },
  { "type":"function", "name":"linkDID", "stateMutability":"nonpayable", "inputs":[{"name":"did","type":"string"}], "outputs":[] }
] as const;
