#!/usr/bin/env node

/**
 * Corrects the July 2025 token memo "E.D.A.I. Guardian Credentials - Verified AI Network"
 * on both Guardian tokens (the one in use and the unused duplicate).
 *
 * The old memo stays visible in the ledger history. This only changes what the
 * token says about itself from now on.
 *
 * Requires the key for account 0.0.9083680, which is the admin key on both tokens.
 * Read from the environment, never from a file in this repository:
 *
 *   HEDERA_ACCOUNT_ID=0.0.9083680 HEDERA_PRIVATE_KEY=... node correct-token-memos.js
 *
 * Add --dry-run to print what would change without sending anything.
 */

const { Client, PrivateKey, AccountId, TokenUpdateTransaction, TokenInfoQuery } = require("@hashgraph/sdk");

const UPDATES = [
    { tokenId: "0.0.9375999", memo: "E.D.A.I. Guardian Credential (prototype). Not a certification. See edai.quest/state-of-the-work" },
    { tokenId: "0.0.9376140", memo: "E.D.A.I. unused duplicate from a second deploy run, 2025-07-16. Not in use." }
];

async function main() {
    const dryRun = process.argv.includes("--dry-run");
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const keyStr = process.env.HEDERA_PRIVATE_KEY;
    if (!accountId || !keyStr) {
        console.error("Set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in the environment.");
        process.exit(1);
    }

    const key = PrivateKey.fromString(keyStr);
    const client = Client.forMainnet();
    client.setOperator(AccountId.fromString(accountId), key);

    for (const { tokenId, memo } of UPDATES) {
        if (memo.length > 100) throw new Error(`Memo for ${tokenId} is over 100 bytes`);
        const info = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
        console.log(`\n${tokenId}`);
        console.log(`  now:   ${info.tokenMemo}`);
        console.log(`  after: ${memo}`);
        if (dryRun) continue;

        const tx = await new TokenUpdateTransaction()
            .setTokenId(tokenId)
            .setTokenMemo(memo)
            .freezeWith(client)
            .sign(key);
        const receipt = await (await tx.execute(client)).getReceipt(client);
        console.log(`  result: ${receipt.status.toString()}`);
    }

    client.close();
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
