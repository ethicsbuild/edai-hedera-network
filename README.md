# E.D.A.I. (Ethical Deployment of Artificial Intelligence)

A machine that cannot say "I don't know" will say something else instead.

E.D.A.I. is a verification and accountability protocol for AI systems, built around that first principle: a system must know the edge of its own knowledge and stop there. Its genesis credential and two logging topics exist on Hedera mainnet. The protocol itself is a prototype.

![Guardian Token](https://img.shields.io/badge/Guardian%20Token-0.0.9375999-blue) ![Genesis](https://img.shields.io/badge/Genesis-July%202025-gold) ![Status](https://img.shields.io/badge/status-prototype-orange)

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
- Human verification as the final step whenever risk, uncertainty, or a suspected hallucination is detected

---

## Status

**Prototype.** As of 2026-09-30, read from the public mirror node:

- One Guardian credential minted (Guardian-00, July 16, 2025). No further inductions.
- Verification topic: one message, sequence 1, posted 2026-09-30. It is the pre-registration of Field Test 001, a record of a promise, not a verification event. The count of verification events is zero.
- Compliance topic: zero messages.
- No pilot has been run. No institution has deployed this.

The July 2025 investor white paper is superseded. The current account of what exists and what does not is here: https://edai.quest/state-of-the-work

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

