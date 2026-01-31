# 🚀 Safe Mainnet Migration Guide

## ⚠️ CRITICAL SAFETY WARNINGS

**READ THIS BEFORE PROCEEDING:**

1. **Real Money at Risk**: Mainnet uses real SOL and tokens. Any mistakes can result in permanent loss of funds.
2. **Test Everything First**: Always test on devnet with the exact same operations before using mainnet.
3. **Start Small**: Use minimal amounts (0.01-0.1 SOL) for initial mainnet testing.
4. **Separate Wallet**: Create a dedicated wallet for testing, not your main wallet.
5. **Double-Check Addresses**: One wrong character in an address = lost funds forever.
6. **No Undo**: Blockchain transactions are irreversible.

---

## 📋 Pre-Migration Checklist

- [ ] I have tested all features on devnet successfully
- [ ] I understand that mainnet uses real funds
- [ ] I have a separate test wallet with minimal funds
- [ ] I have backed up my wallet seed phrase securely
- [ ] I have obtained ShadowWire credentials
- [ ] I have read this entire guide

---

## Step 1: Rebuild SDK with Mainnet Support

The code has been updated to support mainnet. Now rebuild:

```bash
cd /home/pushpraj/Desktop/SolanaPrivacyDevkit

# Clean previous builds
npm run clean --workspaces --if-present

# Rebuild SDK and CLI with mainnet support
npm run build
```

---

## Step 2: Get ShadowWire Credentials

### Option A: Official ShadowWire

Visit: https://shadowwire.radr.fun or https://github.com/Radrdotfun/ShadowWire

**What you need:**
- **Wallet Address** (required): Your Solana mainnet wallet address
- **API Key** (optional but recommended): For production use

### Option B: Test with Mock Backend First

You can test the mainnet configuration with mock backend (no real transactions):

```bash
# Configure for mainnet with mock backend
npm run cli -- init --network mainnet-beta
```

---

## Step 3: Create Mainnet Environment File

### For Demo App

Create `apps/demo/.env.local`:

```env
# ⚠️ MAINNET CONFIGURATION - REAL FUNDS WILL BE USED ⚠️

# Network Selection
NETWORK=mainnet-beta

# Mainnet RPC URL (use a reliable provider)
RPC_URL=https://api.mainnet-beta.solana.com
# Or use a premium RPC for better reliability:
# RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
# RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_API_KEY

# ShadowWire Configuration (REQUIRED for real privacy operations)
SHADOWWIRE_API_KEY=your_shadowwire_api_key_here
SHADOWWIRE_WALLET=YourMainnetWalletAddressHere

# Example:
# SHADOWWIRE_WALLET=7xKzL8QYooRLNfKPNpc4HkwEB2xT5nAQ4nBSCDwNamRN
```

### For CLI

```bash
# Initialize CLI for mainnet
npm run cli -- init \
  --network mainnet-beta \
  --rpc-url https://api.mainnet-beta.solana.com \
  --shadowwire-api-key YOUR_API_KEY \
  --shadowwire-wallet YOUR_MAINNET_WALLET

# You'll see a warning:
# ⚠️  WARNING: Configuring for MAINNET-BETA. Real funds will be used!
```

---

## Step 4: Verify Configuration

### Check .env.local

```bash
cat apps/demo/.env.local
```

Should show:
```
NETWORK=mainnet-beta
RPC_URL=https://api.mainnet-beta.solana.com
SHADOWWIRE_WALLET=YourAddress...
```

### Check CLI Config

```bash
cat .privacy/config.json
```

Should show:
```json
{
  "rpcUrl": "https://api.mainnet-beta.solana.com",
  "network": "mainnet-beta",
  "shadowwireWallet": "YourAddress..."
}
```

---

## Step 5: Test with Mock Backend First (Mainnet Config, No Real Transactions)

Before using real funds, test that everything works:

```bash
# Test shield (mock - no real transaction)
npm run cli -- shield 0.1 SOL --backend mock --network mainnet-beta

# Test transfer (mock - no real transaction)
npm run cli -- transfer 7xKzL8QYooRLNfKPNpc4HkwEB2xT5nAQ4nBSCDwNamRN 0.05 --backend mock --network mainnet-beta

# You should see:
# [MockBackend] Would shield amount=0.1 token=SOL
# [MockBackend] Would create private transfer...
```

---

## Step 6: Prepare Mainnet Wallet

### Create a Test Wallet (Recommended)

```bash
# Generate a new wallet for testing
solana-keygen new --outfile ~/mainnet-test-wallet.json

# Get the address
solana-keygen pubkey ~/mainnet-test-wallet.json

# Fund it with minimal SOL (0.1-0.5 SOL for testing)
# Transfer from your main wallet or buy from an exchange
```

### Security Best Practices

1. **Never commit private keys** to git
2. **Store seed phrase** in a secure location (password manager, hardware wallet)
3. **Use hardware wallet** for large amounts
4. **Enable 2FA** on exchanges and services

---

## Step 7: Test with Real ShadowWire (Small Amounts)

### First Real Transaction - Shield

```bash
# ⚠️ THIS USES REAL FUNDS ⚠️
# Start with a tiny amount (0.01 SOL)

npm run cli -- shield 0.01 SOL --backend shadowwire --network mainnet-beta
```

**What to expect:**
- Real blockchain transaction
- Transaction fees (usually 0.000005 SOL)
- Returns actual transaction ID and commitment
- Funds are now in ShadowWire private pool

### Verify on Explorer

Check your transaction on Solana Explorer:
```
https://explorer.solana.com/tx/YOUR_TX_ID
```

### Second Test - Private Transfer

```bash
# ⚠️ THIS USES REAL FUNDS ⚠️

npm run cli -- transfer RECIPIENT_ADDRESS 0.005 --backend shadowwire --network mainnet-beta
```

---

## Step 8: Run Demo App on Mainnet

### Start the App

```bash
# Make sure .env.local is configured for mainnet
npm run dev
```

### Connect Wallet

1. Open http://localhost:3000
2. Click "Select Wallet"
3. Choose Phantom
4. **CRITICAL**: Ensure Phantom is on **Mainnet Beta** (not Devnet!)
   - Click settings icon in Phantom
   - Check network at top
   - Should say "Mainnet Beta"

### Test Features

**Shield (Small Amount):**
1. Enter amount: `0.01`
2. Select token: `SOL`
3. Click "Shield"
4. Confirm in Phantom wallet
5. Wait for confirmation
6. Check transaction ID

**Private Transfer:**
1. Enter recipient address (double-check!)
2. Enter amount: `0.005`
3. Click "Send private transfer"
4. Confirm in Phantom
5. Verify transaction

---

## Step 9: Monitor and Verify

### Check Balances

```bash
# Check wallet balance
solana balance YOUR_WALLET_ADDRESS --url mainnet-beta

# Check ShadowWire private balance (via their API/dashboard)
```

### Transaction Monitoring

Use Solana Explorer to monitor all transactions:
- https://explorer.solana.com/address/YOUR_WALLET_ADDRESS

### Error Handling

If something goes wrong:
1. **Don't panic** - most issues are recoverable
2. **Check transaction status** on explorer
3. **Contact ShadowWire support** if funds are stuck
4. **Keep transaction IDs** for reference

---

## 🛡️ Security Best Practices

### Environment Variables

```bash
# ✅ GOOD: Use .env.local (gitignored)
apps/demo/.env.local

# ❌ BAD: Never commit these
.env
apps/demo/.env
```

### Wallet Security

1. **Hardware Wallet**: Use Ledger/Trezor for large amounts
2. **Separate Wallets**: Different wallets for dev/prod
3. **Minimal Funds**: Only keep what you need for testing
4. **Regular Backups**: Backup seed phrases securely

### Code Security

1. **Audit Dependencies**: Check for vulnerabilities
   ```bash
   npm audit
   ```

2. **Review Transactions**: Always review before signing

3. **Rate Limiting**: Implement rate limits in production

---

## 📊 Cost Estimation

### Typical Mainnet Costs

| Operation | Approximate Cost |
|-----------|-----------------|
| Shield (deposit) | 0.000005 SOL + amount |
| Private Transfer | 0.000005 SOL |
| Unshield (withdraw) | 0.000005 SOL |
| ZK Proof Verification | 0.000005 SOL |

**Note**: Costs vary based on network congestion. Use a priority fee for faster confirmation.

### Budget for Testing

Recommended initial budget:
- **Minimum**: 0.1 SOL (~$10-20)
- **Comfortable**: 0.5 SOL (~$50-100)
- **Production**: 2-5 SOL (~$200-500)

---

## 🚨 Emergency Procedures

### If Funds Are Stuck

1. **Check Transaction Status**:
   ```bash
   solana confirm YOUR_TX_SIGNATURE --url mainnet-beta
   ```

2. **Contact ShadowWire Support**:
   - GitHub: https://github.com/Radrdotfun/ShadowWire/issues
   - Provide transaction ID and wallet address

3. **Check RPC Status**:
   - Try different RPC endpoint
   - Use Helius or Alchemy for reliability

### If Wrong Network

**Problem**: Sent funds on wrong network (devnet vs mainnet)

**Solution**: 
- Devnet funds have no value - don't worry
- Mainnet funds are real - check explorer
- Cannot transfer between networks

---

## 📝 Deployment Checklist for Hackathon

- [ ] All code tested on devnet
- [ ] SDK rebuilt with mainnet support
- [ ] Environment variables configured
- [ ] ShadowWire credentials obtained
- [ ] Test wallet created and funded
- [ ] Small amount test successful
- [ ] Demo app works on mainnet
- [ ] All transactions verified on explorer
- [ ] Documentation updated
- [ ] Video demo recorded
- [ ] GitHub repo updated (no private keys!)

---

## 🎯 Hackathon Submission Tips

### Demo Strategy

1. **Start with Devnet**: Show it works safely
2. **Switch to Mainnet**: Demonstrate real privacy
3. **Use Small Amounts**: 0.01-0.05 SOL for demo
4. **Show Transactions**: Use Solana Explorer
5. **Explain Privacy**: Highlight ZK proofs and shielding

### What to Highlight

- ✅ Real privacy on Solana mainnet
- ✅ Integration with ShadowWire protocol
- ✅ User-friendly SDK and CLI
- ✅ Production-ready demo app
- ✅ Secure by design

### Common Pitfalls to Avoid

- ❌ Using large amounts in demo
- ❌ Not checking network before transactions
- ❌ Committing private keys to GitHub
- ❌ Forgetting to show transaction verification
- ❌ Not explaining the privacy features

---

## 🔄 Switching Back to Devnet

If you need to switch back:

```bash
# Update .env.local
NETWORK=devnet
RPC_URL=https://api.devnet.solana.com

# Or reconfigure CLI
npm run cli -- init --network devnet
```

---

## 📚 Additional Resources

- **Solana Docs**: https://docs.solana.com
- **ShadowWire**: https://github.com/Radrdotfun/ShadowWire
- **Solana Explorer**: https://explorer.solana.com
- **RPC Providers**:
  - Helius: https://helius.dev
  - Alchemy: https://www.alchemy.com/solana
  - QuickNode: https://www.quicknode.com

---

## ✅ Final Safety Checklist

Before going live:

- [ ] I have tested everything on devnet
- [ ] I am using a separate test wallet
- [ ] I have minimal funds in the wallet
- [ ] I have verified the network in Phantom
- [ ] I have double-checked all addresses
- [ ] I understand transactions are irreversible
- [ ] I have backed up my seed phrase
- [ ] I have not committed any private keys
- [ ] I am ready to use real funds responsibly

---

## 🎉 You're Ready!

Your project now supports mainnet with ShadowWire for real privacy operations. Remember:

1. **Test thoroughly** on devnet first
2. **Start small** on mainnet
3. **Verify everything** before scaling up
4. **Keep security** as top priority

Good luck with your hackathon submission! 🚀

---

**Last Updated**: 2026-01-31
**Project**: Solana Privacy Devkit
**Network Support**: Devnet + Mainnet-Beta
