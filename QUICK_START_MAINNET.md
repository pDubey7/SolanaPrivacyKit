# 🚀 Quick Start: Mainnet Migration

## ✅ What Was Changed

Your project now supports **mainnet-beta** for real privacy operations with ShadowWire!

### Modified Files:
1. ✅ `packages/sdk/src/config.ts` - Added mainnet support
2. ✅ `packages/sdk/src/client.ts` - Pass network to backends
3. ✅ `packages/sdk/src/backends/shadowwire.ts` - Configurable network
4. ✅ `packages/cli/src/index.ts` - Mainnet CLI commands
5. ✅ `packages/cli/src/config-loader.ts` - Load mainnet config
6. ✅ `README.md` - Updated documentation
7. ✅ `MAINNET_MIGRATION_GUIDE.md` - Complete migration guide (NEW)

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Rebuild Everything

```bash
cd /home/pushpraj/Desktop/SolanaPrivacyDevkit
npm run build
```

### Step 2: Configure for Mainnet

**Option A: Demo App**
```bash
# Create apps/demo/.env.local
cat > apps/demo/.env.local << 'EOF'
NETWORK=mainnet-beta
RPC_URL=https://api.mainnet-beta.solana.com
SHADOWWIRE_WALLET=YOUR_MAINNET_WALLET_ADDRESS
SHADOWWIRE_API_KEY=YOUR_API_KEY
EOF
```

**Option B: CLI**
```bash
npm run cli -- init \
  --network mainnet-beta \
  --shadowwire-wallet YOUR_WALLET_ADDRESS \
  --shadowwire-api-key YOUR_API_KEY
```

### Step 3: Test (Mock First, Then Real)

```bash
# Test with mock (no real funds)
npm run cli -- shield 0.01 SOL --backend mock --network mainnet-beta

# Test with ShadowWire (REAL FUNDS - start tiny!)
npm run cli -- shield 0.01 SOL --backend shadowwire --network mainnet-beta
```

---

## ⚠️ CRITICAL SAFETY RULES

1. **Always test on devnet first** before mainnet
2. **Use tiny amounts** (0.01 SOL) for first mainnet test
3. **Create separate test wallet** - don't use your main wallet
4. **Double-check network** in Phantom (must be "Mainnet Beta")
5. **Verify addresses** - one typo = lost funds forever

---

## 🔄 Network Switching

### Devnet (Testing)
```bash
# .env.local or CLI config
NETWORK=devnet
RPC_URL=https://api.devnet.solana.com
```

### Mainnet (Production)
```bash
# .env.local or CLI config
NETWORK=mainnet-beta
RPC_URL=https://api.mainnet-beta.solana.com
SHADOWWIRE_WALLET=your_address
```

---

## 📋 Pre-Flight Checklist

Before using mainnet:

- [ ] Rebuilt SDK: `npm run build`
- [ ] Created `.env.local` with `NETWORK=mainnet-beta`
- [ ] Have ShadowWire wallet address
- [ ] Tested on devnet successfully
- [ ] Using separate test wallet
- [ ] Have minimal funds (0.1-0.5 SOL)
- [ ] Read [MAINNET_MIGRATION_GUIDE.md](MAINNET_MIGRATION_GUIDE.md)

---

## 🎬 For Your Hackathon Demo

### Demo Script

1. **Show Devnet First** (safe):
   ```bash
   npm run dev
   # Connect wallet (Devnet)
   # Shield 1 SOL
   # Transfer 0.5 SOL
   ```

2. **Switch to Mainnet** (real privacy):
   ```bash
   # Update .env.local to mainnet
   # Restart app
   # Connect wallet (Mainnet Beta!)
   # Shield 0.01 SOL (tiny amount)
   # Show transaction on explorer
   ```

3. **Highlight**:
   - ✅ Real privacy on Solana mainnet
   - ✅ ShadowWire integration
   - ✅ ZK proof verification
   - ✅ Production-ready

---

## 🆘 Quick Troubleshooting

### TypeScript Errors After Changes

```bash
# Rebuild SDK
npm run build:sdk
npm run build:cli
```

### "Wrong Network" Error

Check Phantom wallet:
- Click settings icon
- Network should match your config
- Devnet vs Mainnet Beta

### Funds Not Appearing

1. Check transaction on explorer:
   ```
   https://explorer.solana.com/tx/YOUR_TX_ID
   ```
2. Wait 30-60 seconds for confirmation
3. Check ShadowWire dashboard for private balance

---

## 📚 Full Documentation

- **Complete Guide**: [MAINNET_MIGRATION_GUIDE.md](MAINNET_MIGRATION_GUIDE.md)
- **Project Overview**: [README.md](README.md)
- **Codebase Walkthrough**: See artifacts

---

## 🎉 You're Ready!

Your Solana Privacy Devkit now supports:
- ✅ Devnet (testing)
- ✅ Mainnet-Beta (production)
- ✅ ShadowWire (real privacy)
- ✅ Mock backend (development)

**Next**: Rebuild, configure, test carefully, and wow the judges! 🚀

---

**Need Help?**
- Read: [MAINNET_MIGRATION_GUIDE.md](MAINNET_MIGRATION_GUIDE.md)
- ShadowWire: https://github.com/Radrdotfun/ShadowWire
- Solana Docs: https://docs.solana.com
