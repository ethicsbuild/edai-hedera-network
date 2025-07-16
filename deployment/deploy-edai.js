#!/usr/bin/env node

/**
 * E.D.A.I. HEDERA MAINNET DEPLOYMENT SCRIPT
 * 
 * Deploys the complete E.D.A.I. verification network to Hedera Hashgraph
 * 
 * Requirements:
 * - Hedera account with sufficient HBAR (~10 for full deployment)
 * - Account ID and private key
 * 
 * Usage: node deploy-edai.js
 */

const {
    Client,
    PrivateKey,
    AccountId,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TopicCreateTransaction,
    Hbar
} = require("@hashgraph/sdk");

// Color output for terminal
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

async function deployEDAI() {
    log("🚀 E.D.A.I. Hedera Mainnet Deployment Starting...", 'blue');
    log("=" * 60, 'blue');
    
    // Get credentials from environment or prompt
    const accountId = process.env.HEDERA_ACCOUNT_ID || 
        await promptForInput("Enter Hedera Account ID (0.0.xxxxx): ");
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY || 
        await promptForInput("Enter Private Key: ");
    
    if (!accountId || !privateKeyStr) {
        log("❌ Missing credentials. Set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY environment variables", 'red');
        process.exit(1);
    }
    
    try {
        // Initialize Hedera client
        const accountIdObj = AccountId.fromString(accountId);
        const privateKey = PrivateKey.fromString(privateKeyStr);
        const client = Client.forMainnet();
        client.setOperator(accountIdObj, privateKey);
        
        log(`🔗 Connected to Hedera Mainnet`, 'green');
        log(`📱 Operator Account: ${accountId}`, 'blue');
        
        // Phase 1: Deploy Guardian Token
        log("\n🛡️ Phase 1: Deploying Guardian Token...", 'yellow');
        
        const guardianTokenTx = await new TokenCreateTransaction()
            .setTokenName("E.D.A.I. Guardian Credential")
            .setTokenSymbol("EDAI-GUARD")
            .setTokenType(TokenType.NonFungibleUnique)
            .setSupplyType(TokenSupplyType.Infinite)
            .setTreasuryAccountId(accountIdObj)
            .setSupplyKey(privateKey)
            .setAdminKey(privateKey)
            .setMetadataKey(privateKey)
            .setTokenMemo("E.D.A.I. Guardian Credentials - Verified AI Network")
            .setMaxTransactionFee(new Hbar(10))
            .execute(client);
        
        const tokenReceipt = await guardianTokenTx.getReceipt(client);
        const tokenId = tokenReceipt.tokenId;
        
        log(`✅ Guardian Token deployed: ${tokenId}`, 'green');
        
        // Phase 2: Create Verification Topic
        log("\n📝 Phase 2: Creating HCS Verification Topic...", 'yellow');
        
        const verificationTopicTx = await new TopicCreateTransaction()
            .setTopicMemo("E.D.A.I. Verification Events - 4-Step Ritual Logging")
            .setAdminKey(privateKey)
            .setSubmitKey(privateKey)
            .setMaxTransactionFee(new Hbar(2))
            .execute(client);
        
        const verificationReceipt = await verificationTopicTx.getReceipt(client);
        const verificationTopicId = verificationReceipt.topicId;
        
        log(`✅ Verification Topic created: ${verificationTopicId}`, 'green');
        
        // Phase 3: Create Compliance Topic
        log("\n⚖️ Phase 3: Creating HCS Compliance Topic...", 'yellow');
        
        const complianceTopicTx = await new TopicCreateTransaction()
            .setTopicMemo("E.D.A.I. Compliance Events - Guardian Status Changes")
            .setAdminKey(privateKey)
            .setSubmitKey(privateKey)
            .setMaxTransactionFee(new Hbar(2))
            .execute(client);
        
        const complianceReceipt = await complianceTopicTx.getReceipt(client);
        const complianceTopicId = complianceReceipt.topicId;
        
        log(`✅ Compliance Topic created: ${complianceTopicId}`, 'green');
        
        // Deployment Summary
        log("\n" + "=" * 60, 'blue');
        log("🎉 E.D.A.I. MAINNET DEPLOYMENT COMPLETE!", 'green');
        log("=" * 60, 'blue');
        
        const deploymentInfo = {
            timestamp: new Date().toISOString(),
            network: 'mainnet',
            operator: accountId,
            guardianToken: tokenId.toString(),
            verificationTopic: verificationTopicId.toString(),
            complianceTopic: complianceTopicId.toString(),
            status: 'DEPLOYED'
        };
        
        console.table(deploymentInfo);
        
        log("\n🔗 Network URLs:", 'blue');
        log(`Guardian Token: https://hashscan.io/mainnet/token/${tokenId}`, 'blue');
        log(`Verification Topic: https://hashscan.io/mainnet/topic/${verificationTopicId}`, 'blue');
        log(`Compliance Topic: https://hashscan.io/mainnet/topic/${complianceTopicId}`, 'blue');
        
        log("\n📋 Next Steps:", 'yellow');
        log("1. Run 'node mint-guardian.js' to create your first guardian", 'yellow');
        log("2. Begin guardian induction ceremonies", 'yellow');
        log("3. Start logging verification events to HCS", 'yellow');
        log("4. Share network details with institutions", 'yellow');
        
        log("\n🌍 The world's first verified AI network is LIVE!", 'green');
        
        // Save deployment info to file
        const fs = require('fs');
        fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
        log("\n💾 Deployment info saved to deployment-info.json", 'blue');
        
        return deploymentInfo;
        
    } catch (error) {
        log(`❌ Deployment failed: ${error.message}`, 'red');
        if (error.status) {
            log(`Status: ${error.status}`, 'red');
        }
        process.exit(1);
    }
}

// Helper function for prompting user input
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
    deployEDAI().catch(console.error);
}

module.exports = { deployEDAI };
