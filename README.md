# E.D.A.I. (Ethical Deployment of Artificial Intelligence)

A verification and accountability protocol for AI systems, with its genesis credential live on Hedera Hashgraph.

![Guardian Token](https://img.shields.io/badge/Guardian%20Token-0.0.9375999-blue) ![Genesis](https://img.shields.io/badge/Genesis-July%202025-gold) ![Status](https://img.shields.io/badge/status-genesis%20credential%20live-brightgreen)

---

## What is E.D.A.I.?

E.D.A.I. (Ethical Deployment of Artificial Intelligence) is a verification framework designed to help AI systems operate with transparency, accountability, and human oversight. Built on Hedera Hashgraph, it is designed to provide cryptographic proof that AI outputs have been verified before deployment.

### The problem
- AI systems make confident statements that may be false
- Outputs can be corrupted without the system knowing
- Most AI deployments lack verification loops
- There is no audit trail for AI decision-making

### The design
- A four-step verification ritual for critical AI outputs
- Guardian credentials as NFTs on Hedera Hashgraph
- Immutable audit trails via Hedera Consensus Service
- Human verification as the mandatory final step

---

## Status

Genesis credential live on Hedera mainnet. Network operations (guardian inductions, verification logging) have not begun.

- Guardian Token: [`0.0.9375999`](https://hashscan.io/mainnet/token/0.0.9375999)
- Verification Topic: [`0.0.9376001`](https://hashscan.io/mainnet/topic/0.0.9376001)
- Compliance Topic: [`0.0.9376002`](https://hashscan.io/mainnet/topic/0.0.9376002)
- Genesis Guardian: Serial #1 (Guardian-00)

---

## Quick start (deploy the scaffold)

This repository contains the deployment scripts for the E.D.A.I. credential and topics.

```
git clone https://github.com/ethicsbuild/edai-hedera-network.git
cd edai-hedera-network/deployment
npm install
# Deploy to Hedera (requires HBAR and your own Hedera account credentials)
node deploy-edai.js
```

---

