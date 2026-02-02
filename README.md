# Solana Privacy Devkit 🛡️

A comprehensive developer kit for building privacy-preserving applications on Solana. This monorepo includes a TypeScript SDK, a Command Line Interface (CLI), an Anchor program, and a full-featured demo application. 

**Supports both Devnet (Testing) and Mainnet-Beta (Production with ShadowWire).**

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (for workspaces support)
- **Solana CLI**: (Optional, for managing local keys)
- **Anchor CLI**: (Optional, for building/deploying the program)

### 2. Installation
Clone the repository and install dependencies using npm workspaces:
```bash
git clone <repo-url>
cd SolanaPrivacyDevkit
npm install
```

### 3. Build the Project
Build all packages (SDK, CLI, and Demo App) in one command:
```bash
npm run build
```

---

## 💻 Command Line Interface (CLI)

The CLI is the easiest way to interact with the privacy protocols.

### Configuration
Initialize your local configuration (`.privacy/config.json`). This sets your RPC and network preference.

**Devnet (Default):**
```bash
npm run cli -- init
```

**Mainnet (Requires Attention):**
```bash
npm run cli -- init --network mainnet-beta --rpc-url https://api.mainnet-beta.solana.com
```

### Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `shield` | `npm run cli -- shield <amount> <token>` | Deposit funds into the privacy pool. |
| `transfer`| `npm run cli -- transfer <recipient> <amount>`| Execute a private transfer to another address. |
| `unshield`| `npm run cli -- unshield <amount> <token>` | Withdraw funds from the privacy pool to your wallet. |
| `verify`  | `npm run cli -- verify <proof-hex>` | Verify a ZK proof against the backend. |

**Pro Tip**: Use `--backend shadowwire` to use the production privacy provider, or `--backend mock` for local testing without real funds.

---

## 🌐 Demo Application (Next.js)

The demo app provides a beautiful UI for shielding, transferring, and verifying transactions.

### 1. Environment Setup
Copy the example environment file and configure your settings:
```bash
cp .env.example apps/demo/.env.local
```
Edit `apps/demo/.env.local` to set your `RPC_URL` and `NETWORK`.

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Ensure your Phantom wallet is set to the correct network (Devnet or Mainnet) before connecting.

---

## 🛠️ Software Development Kit (SDK)

Integrate privacy features directly into your own Solana applications.

### Installation
```bash
npm install @solana-privacy/sdk
```

### Usage Example
```typescript
import { PrivacyClient } from '@solana-privacy/sdk';

const client = new PrivacyClient({
  network: 'devnet',
  backend: 'shadowwire' // or 'mock' for testing
});

// Shield 1 SOL
const result = await client.shieldAmount(1, 'SOL');
console.log('Shield Transaction:', result.txId);

// Private Transfer
await client.createPrivateTransfer('RecipientAddress...', 0.5);
```

---

## 🔒 Security & Best Practices

1. **Environment Variables**: Never commit your `.env.local` or `.privacy/config.json` files. They are already added to `.gitignore`.
2. **Private Keys**: Avoid hardcoding private keys. Use environment variables like `SOLANA_PRIVATE_KEY` for the CLI.
3. **Small Steps**: When moving to Mainnet, always test with small amounts (e.g., 0.01 SOL) first.
4. **ShadowWire Integration**: Ensure you have valid ShadowWire credentials for production mainnet use.

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.
