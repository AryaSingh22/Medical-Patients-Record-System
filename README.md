# Medical Patients Record System

A monorepo for a secure, gas-optimized Medical Patients Record System consisting of:

- `ocpr-contracts/` — Solidity smart contracts (Foundry) with patient-scoped access control, pausable operations, and audit logging.
- `ocpr-web/` — Next.js frontend for interacting with the contracts.
- `subgraph/` — The Graph subgraph for indexing on-chain data.

## Repository Structure

- `ocpr-contracts/`
  - Contracts: `AccessManager.sol`, `RecordManager.sol`, `PatientRegistry.sol`, `KeyManager.sol`, `AuditLog.sol`
  - Tests: Foundry (forge-std)
  - Scripts: `script/Deploy.s.sol`
- `ocpr-web/`
  - Next.js app and hooks
  - ABIs in `src/abi/`
- `subgraph/`
  - `schema.graphql`, `mapping.ts`, and config files

## Prerequisites

- Git
- Node.js 18+
- Foundry (forge & cast): https://book.getfoundry.sh/getting-started/installation
- (Optional) graph-cli for subgraph deployments

## Quick Start

### 1) Contracts — `ocpr-contracts/`

Install dependencies (OpenZeppelin v5 is referenced via remappings):

```powershell
# Windows PowerShell
# from: c:\Pro\Medical Patients Record System\ocpr-contracts
forge install OpenZeppelin/openzeppelin-contracts@v5.0.2 --no-commit
```

Build and test:

```powershell
forge build
forge test -vv
```

Deploy (optional):

```powershell
# Set your PRIVATE_KEY and an RPC URL (example vars)
$env:PRIVATE_KEY = "0xYOUR_PRIVATE_KEY"
$env:AMOY_RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/xxxxxxxx"

forge script script/Deploy.s.sol --rpc-url $env:AMOY_RPC_URL --broadcast
```

Notes:
- `AccessManager` enforces `onlyRole(DEFAULT_ADMIN_ROLE)` and `whenNotPaused` on grant/revoke.
- Reverts: "Invalid grantee", "Invalid expiry", and OZ v5 `Pausable.EnforcedPause`.

### 2) Web App — `ocpr-web/`

```powershell
# from: c:\Pro\Medical Patients Record System\ocpr-web
Copy-Item .env.example .env.local
# edit .env.local for RPC, chainId, addresses, API keys

npm install
npm run dev
# open http://localhost:3000
```

Update deployed contract addresses and ABIs in `ocpr-web/src/abi/` as needed.

### 3) Subgraph — `subgraph/`

```powershell
# from: c:\Pro\Medical Patients Record System\subgraph
npm install
npm run codegen
npm run build
```

(Optional) Deploy with graph-cli:

```powershell
graph auth --studio <YOUR_TOKEN>
graph deploy --studio <SUBGRAPH_NAME>
```

## Linting & Formatting

- Solidity: follows Foundry defaults; maintain imports and NatSpec per OZ best practices.
- TypeScript/JS: use project defaults in `ocpr-web/`.

## Security & Design Highlights

- Patient-scoped RBAC with expiries per `AccessManager`.
- `Pausable` emergency stop across critical functions.
- `AuditLog` for traceability of grants/revokes and record mutations.
- Gas-conscious struct ordering and custom errors.

## Contributing

1. Create a feature branch.
2. Add tests for any changes (contracts: Foundry).
3. Ensure `forge test` passes.
4. Open a PR with a clear description and rationale.

## License

MIT
