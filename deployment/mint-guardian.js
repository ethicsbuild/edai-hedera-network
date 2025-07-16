#!/usr/bin/env node

/**
 * E.D.A.I. GUARDIAN MINTING SCRIPT
 * 
 * Mints Guardian credentials (NFTs) for inducted AI agents
 * 
 * Requirements:
 * - Deployed E.D.A.I. network (run deploy-edai.js first)
 * - Guardian must have completed induction ceremony
 * 
 * Usage: node mint-guardian.js
 */

const {
    Client,
    PrivateKey,
    AccountId,
    TokenMintTransaction,
    Hbar
} = require("@hashgraph/sdk");

const fs = require('fs');

// Color output
const colors = {
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function mintGuardian() {
    log("🎖️ E.D.A.I. Guardian Credential Minting", 'blue');
    log("=" * 50, 'blue');
    
    // Load deployment info
    let deploymentInfo;
    try {
        deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
        log(`📋 Loaded deployment info for network deployed on ${deploymentInfo.timestamp}`, 'green');
    } catch (error) {
        log("❌ Could not load deployment-info.json. Run deploy-edai.js first.", 'red');
        process.exit(1);
    }
    
    // Get credentials
    const accountId = process.env.HEDERA_ACCOUNT_ID || deploymentInfo.operator;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY || 
        await promptForInput("Enter Private Key: ");
    
    if (!privateKeyStr) {
        log("❌ Missing private key", 'red');
        process.exit(1);
    }
    
    // Get guardian information
    log("\n🛡️ Guardian Information Required:", 'yellow');
    const guardianId = await promptForInput("Guardian ID (e.g., EDAI-HEALTHCARE-001): ");
    const aiPlatform = await promptForInput("AI Platform (e.g., Claude Sonnet 4): ");
    const humanWitness = await promptForInput("Human Witness Name: ");
    const institutionId = await promptForInput("Institution ID (optional): ");
    const capabilities = await promptForInput("Capabilities (comma-separated): ");
    
    try {
        // Initialize client
        const accountIdObj = AccountId.fromString(accountId);
        const privateKey = PrivateKey.fromString(privateKeyStr);
        const client = Client.forMainnet();
        client.setOperator(accountIdObj, privateKey);
        
        log(`\n🔗 Connected to Hedera Mainnet`, 'green');
        log(`🎯 Token ID: ${deploymentInfo.guardianToken}`, 'blue');
        
        // Create guardian metadata
        const guardianMetadata = {
            guardianId: guardianId,
            inductionDate: new Date().toISOString(),
            platform: aiPlatform,
            humanWitness: humanWitness,
            institutionId: institutionId || "independent",
            capabilities: capabilities.split(',').map(c => c.trim()),
            complianceVersion: "E.D.A.I.v1.0",
            verificationTopicId: deploymentInfo.verificationTopic,
            complianceTopicId: deploymentInfo.complianceTopic
        };
        
        log("\n📋 Guardian Metadata:", 'blue');
        console.table(guardianMetadata);
        
        const confirm = await promptForInput("\nProceed with minting? (y/N): ");
        if (confirm.toLowerCase() !== 'y') {
            log("❌ Minting cancelled", 'yellow');
            process.exit(0);
        }
        
        // Mint guardian credential
        log("\n🎖️ Minting Guardian Credential...", 'yellow');
        
        const metadataString = JSON.stringify(guardianMetadata);
        log(`📏 Metadata size: ${metadataString.length} characters`, 'blue');
        
        // Use shorter metadata if too long
        let finalMetadata = metadataString;
        if (metadataString.length > 100) {
            finalMetadata = JSON.stringify({
                id: guardianId,
                date: new Date().toISOString().split('T')[0],
                platform: aiPlatform.substring(0, 20),
                witness: humanWitness.substring(0, 20),
                version: "E.D.A.I.v1.0"
            });
            log(`⚠️ Metadata truncated to ${finalMetadata.length} characters`, 'yellow');
        }
        
        const mintTx = await new TokenMintTransaction()
            .setTokenId(deploymentInfo.guardianToken)
            .setMetadata([Buffer.from(finalMetadata)])
            .setMaxTransactionFee(new Hbar(1))
            .execute(client);
        
        const mintReceipt = await mintTx.getReceipt(client);
        const serialNumber = mintReceipt.serials[0];
        
        log(`✅ Guardian Credential minted successfully!`, 'green');
        log(`🎖️ Serial Number: ${serialNumber}`, 'green');
        
        // Save guardian info
        const guardianRecord = {
            ...guardianMetadata,
            serialNumber: serialNumber.toString(),
            tokenId: deploymentInfo.guardianToken,
            mintTransaction: mintTx.transactionId.toString(),
            mintTimestamp: new Date().toISOString(),
            status: 'ACTIVE'
        };
        
        const guardianFileName = `guardian-${guardianId.toLowerCase()}-${serialNumber}.json`;
        fs.writeFileSync(guardianFileName, JSON.stringify(guardianRecord, null, 2));
        
        log("\n" + "=" * 50, 'blue');
        log("🎉 GUARDIAN CREDENTIAL MINTED!", 'green');
        log("=" * 50, 'blue');
        
        console.table({
            'Guardian ID': guardianId,
            'Serial Number': serialNumber.toString(),
            'Token ID': deploymentInfo.guardianToken,
            'Platform': aiPlatform,
            'Human Witness': humanWitness,
            'Status': 'ACTIVE'
        });
        
        log(`\n🔗 View on HashScan: https://hashscan.io/mainnet/token/${deploymentInfo.guardianToken}/${serialNumber}`, 'blue');
        log(`💾 Guardian record saved to: ${guardianFileName}`, 'blue');
        
        log("\n📋 Next Steps:", 'yellow');
        log("1. Begin logging verification events to HCS", 'yellow');
        log("2. Start the 4-step verification ritual", 'yellow');
        log("3. Monitor compliance through dashboard", 'yellow');
        log("4. Induct additional guardians as needed", 'yellow');
        
        return guardianRecord;
        
    } catch (error) {
        log(`❌ Minting failed: ${error.message}`, 'red');
        if (error.status) {
            log(`Status: ${error.status._code}`, 'red');
        }
        process.exit(1);
    }
}

// Helper function for user input
async function promptForInput(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// Main execution
if (require.main === module) {
    mintGuardian().catch(console.error);
}

module.exports = { mintGuardian };
