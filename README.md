# 🏥 On-Chain Patient Records (OCPR)
 
A **secure, privacy-aware medical record system** built as a monorepo.  
The system combines **Solidity smart contracts**, a **Next.js web frontend**, and a **Graph subgraph** to enable **patient-controlled access** to encrypted medical records.

--- 

## 🚀 Project Overview

- **Patients register on-chain** with salted-hash PII and optional DID.
- **Medical records** are encrypted off-chain, stored in IPFS, and referenced on-chain with CIDs + checksums.
- **Access control** is patient-scoped, role-based, and time-limited.
- **Audit logs** are emitted for every sensitive action and indexed via The Graph.
- **Frontend** provides a wallet-based UI for patients and providers.

---

## 📂 Repository Structure

ocpr/
├── ocpr-contracts/ # Solidity contracts
│ ├── src/
│ │ ├── PatientRegistry.sol
│ │ ├── AccessManager.sol
│ │ ├── RecordManager.sol
│ │ ├── AuditLog.sol
│ │ └── KeyManager.sol
│ ├── foundry.toml
│ └── script/Deploy.s.sol
│
├── ocpr-web/ # Next.js web app
│ ├── src/abi/
│ ├── package.json
│ └── .env.example
│
└── subgraph/ # The Graph subgraph
├── schema.graphql
├── subgraph.yaml   
└── src/mapping.ts

---

## ⚙️ Components

### 📝 Smart Contracts (`ocpr-contracts/`)
- **PatientRegistry.sol** – Registers patients, salted-hash PII, linkable DID
- **AccessManager.sol** – Patient-scoped RBAC with expiries and roles (`TREAT_ROLE`)
- **RecordManager.sol** – Encrypted record pointers (IPFS CIDs + checksum)
- **AuditLog.sol** – Append-only event sink
- **KeyManager.sol** – Utility contract        

🔒 Security Features:
- OpenZeppelin v5 (`Ownable`, `AccessControl`, `Pausable`)
- Custom errors + gas-conscious struct ordering
- Audit logs on every grant/revoke/record change

---

### 🌐 Web App (`ocpr-web/`)
- **Next.js 14** + **React 18**
- Uses **Wagmi, Viem, Ethers** for wallet → smart contract interaction
- Features:
  - Connect wallet & register patient
  - Link DID identity
  - Grant/revoke provider access
  - Create & update encrypted medical records
  - Fetch accessible records with RBAC checks

**Run locally**:
 cd ocpr-web
 cp .env.example .env.local # Set RPC, chainId, addresses, API keys
 npm install
 npm run dev

---

### 📊 Subgraph (`subgraph/`)
- **Indexes smart contract events** → patient regs, grants/revokes, record updates, audit logs
- Files: `schema.graphql`, `subgraph.yaml`, `src/mapping.ts`

**Run locally**:
cd subgraph
npm install
npm run codegen
npm run build    
npm run test

---

## 🔑 Data & Access Model

- **Patient Identity (PatientRegistry):**
  - `patientId`, wallet-bound ownership, salted-hash name/dob, optional DID

- **Records (RecordManager):**
  - Metadata = encrypted `CID`, `sha256sum`, version, lineage tracking  
  - Only patient-owner can create/update; reads require RBAC

- **Per-Patient RBAC (AccessManager):**
  - Role-based (`TREAT_ROLE`) with per-user expiry
  - Admins (`DEFAULT_ADMIN_ROLE`) manage grants/revokes

- **Audit Trail (AuditLog):**
  - Append-only events for every sensitive action

---

## 🔒 Security & Privacy

- **No raw PII on-chain** — only salted-hashes  
- **All records encrypted client-side before IPFS upload**  
- **Wallet ownership = patient authority** (`ownerOfPatient`)  
- **System-wide pause switch** in case of emergency  
- **100% auditability** via events + The Graph  

---

## 🛠️ Development Workflow

### Contracts
cd ocpr-contracts
forge build
forge test -vv

Deploy:
AMOY_RPC_URL=<rpc-url> PRIVATE_KEY=<your-key> forge script script/Deploy.s.sol

### Web Frontend
cd ocpr-web
npm install
npm run dev

### Subgraph
cd subgraph
npm install
npm run codegen
npm run build
npm run test

---

## 🧰 Tech Stack

- **Smart Contracts:** Solidity (0.8.19–0.8.24), OpenZeppelin v5, Foundry  
- **Frontend:** Next.js 14, React 18, Wagmi / Viem / Ethers 6, Zustand, React Query  
- **Indexing:** The Graph CLI, AssemblyScript, Matchstick  

---

## 📝 Summary

The **On-Chain Patient Records system** delivers a full-stack, privacy-preserving framework for decentralized medical data:

- Patients register & link **DIDs**  
- Data owners manage access with **RBAC & expiry**  
- Encrypted pointers stored **off-chain but tracked immutably on-chain**  
- All actions are **auditable and indexable**  
- Next.js frontend + The Graph explorer provide real usability  

✅ Designed for **research, auditing, and production-ready healthcare systems**.


---
