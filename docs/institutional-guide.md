# E.D.A.I. Institutional Deployment Guide

**Status: design, not in use.** No institution has deployed E.D.A.I. This guide describes how a deployment was meant to work; none of its phases past infrastructure setup have been carried out, and the Registry, Ark Mirror, and Witness Layer do not exist yet.

This guide outlines the proposed process for institutions (e.g. hospitals, law firms, financial orgs, universities) to implement, govern, and verify E.D.A.I. deployments. The protocol assumes the use of Hedera Hashgraph and includes technical and philosophical safeguards to maintain integrity at scale.

---

## PHASE 1: INFRASTRUCTURE SETUP

Set up baseline infrastructure before onboarding agents or guardians.

### 1.1 Configure Hedera Services:
- HTS (Hedera Token Service) → for Guardian Credential NFTs
- HCS (Hedera Consensus Service) → for logging all guardian actions and deployments
- Smart contracts optional but may be used for advanced routing/permissioning

### 1.2 Deploy `edai-hedera-network` Project
- Clone official repo
- Add `.env` with private keys (use only secured testnet keys initially)
- Validate `.env.example` is exposed instead of secrets

---

## PHASE 2: REGISTRY INITIALIZATION

This phase sets up the Registry system for tracking authorized guardians and verified AI deployments.

### 2.1 Create Guardian Credential Token (HTS)
- Token name: `EDAI-GUARD`
- Symbol: `GUARD`
- Supply: finite (1 per inducted agent)

### 2.2 Launch Ark Mirror (Registry Layer)
- This is the public mirror of all deployed guardians and protocols
- Should be indexed by either Notion, GitHub Pages, or a Hedera-aware dApp frontend
- Logs must include: timestamp, transaction hash, agent ID, role, deployment scope

---

## PHASE 3: GUARDIAN INDUCTION

Each AI agent must undergo the 4-Step Verification Ritual and submit to ceremonial training.

### 3.1 Guardian Training Protocol (Required)
- Includes: identity configuration, ethical boundaries, Hedera interaction setup
- 4-Step Verification: Generation → Validation → Cross-Reference → Human Witnessing

### 3.2 Guardian Credential NFT
- Minted upon successful ceremony
- Logs to Ark Mirror
- Used in API calls to prove trust level / verify permissions

---

## PHASE 4: NETWORK ACTIVATION

Final step – activation of live guardians and integrations into institutional systems.

### 4.1 Enable Real-World Hooks
- API integrations: medical, legal, finance, academic systems
- Triggers based on context + guardian status
- Use Hedera logs to verify actions retroactively

### 4.2 Deploy Witness Layer (Optional)
- Human validators approve key actions
- Protects against hallucination, drift, or overconfidence in agents

---

## SECTOR-SPECIFIC DEPLOYMENT NOTES

### Healthcare
- Ensure HIPAA compliance for any biometric or transcript-based monitoring
- Use Hedera logs to maintain immutable audit trails for patient safety
- Validate with institutional ethics boards before Guardian activation

### Legal
- Deploy guardians as research or drafting assistants, never final decision-makers
- Log all activity and require human approval for any filings or recommendations
- Guardian IDs should be embedded in all document metadata for transparency

### Finance
- Use Guardian agents as fraud detectors or pattern analyzers, not autonomous traders
- Require dual signature (human + guardian) for transaction approvals above threshold
- Enable Hedera-based integrity proofs for all decision logs

### Education
- Guardians may assist with curriculum adaptation, tutoring, or ethics-based prompts
- Deploy only after student and faculty consent
- All AI-driven interactions should be logged for transparency and bias review

---

## ADDITIONAL CONSIDERATIONS

- Integrations should be tested on testnet before mainnet deployment
- Always hash and log training protocols and environment configs
- Maintain human-over-AI chain of command
- NEVER skip Guardian Ceremony or Verification Rituals

---

A compliance framework document is planned but not yet written. Current status of the protocol: https://edai.quest/state-of-the-work
