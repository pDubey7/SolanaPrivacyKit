# privacy-devkit-solana

Monorepo for the Solana Privacy Devkit: SDK, CLI, demo app, and a minimal Anchor program. **Supports both devnet (testing) and mainnet-beta (production with ShadowWire).**

> ⚠️ **MAINNET WARNING**: Mainnet operations use real funds. Always test on devnet first. See [MAINNET_MIGRATION_GUIDE.md](MAINNET_MIGRATION_GUIDE.md) for safe migration instructions.

## Structure

- **packages/sdk** – TypeScript SDK (shield, private transfer, ZK proof verification; mock + ShadowWire backends)
- **packages/cli** – CLI (Commander.js): `privacy init | shield | transfer | verify`
- **apps/demo** – Next.js 14+ demo (Phantom, Tailwind, API routes for shield/transfer/verify)
- **programs/** – Minimal Anchor program (deploy to devnet)

## Prerequisites

- Node.js 18+
- npm 9+ (workspaces)
- (Optional) Rust, Solana CLI, Anchor CLI for building/deploying the program

## Installation

```bash
git clone <repo-url>
cd privacy-devkit-solana
npm install
```

## Build

Build all workspaces (SDK, CLI, demo app):

```bash
npm run build
```

Or build individually:

```bash
npm run build:sdk
npm run build:cli
```

## CLI

After building, run the CLI:

```bash
# Initialize .privacy/config.json (rpcUrl, network)
npm run cli -- init

# Or build CLI and run manually
npm run build:cli
node packages/cli/dist/index.js init
```

Other commands:

```bash
npm run cli -- shield <amount> <token> [--backend mock|shadowwire]
npm run cli -- transfer <recipient> <amount> [--backend mock|shadowwire]
npm run cli -- verify <proof-hex-or-path> [--public-inputs a,b,c]
```

## Demo app

Run the Next.js demo (Phantom wallet, shield/transfer/verify via API routes):

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Optional env: copy `.env.example` to `apps/demo/.env.local` and set `RPC_URL`, `SHADOWWIRE_API_KEY`, `SHADOWWIRE_WALLET` if needed.

## Solana program (Anchor)

Minimal Anchor program under `programs/privacy_devkit`. Deploy to devnet:

1. Install [Rust](https://rustup.rs), [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools), [Anchor](https://www.anchor-lang.com/docs/installation).
2. Configure devnet: `solana config set --url devnet` and fund wallet: `solana airdrop 2`.
3. Build: `anchor build`.
4. (First time) Update `declare_id!` in `programs/privacy_devkit/src/lib.rs` and `[programs.devnet]` in `Anchor.toml` with the program ID from `anchor keys list`.
5. Deploy: `anchor deploy --provider.cluster devnet`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `RPC_URL` | Solana RPC URL (default: devnet) |
| `NETWORK` | Unused; project is devnet-only |
| `SHADOWWIRE_API_KEY` | Optional; when set with `SHADOWWIRE_WALLET`, SDK can use ShadowWire backend |
| `SHADOWWIRE_WALLET` | Wallet address for ShadowWire deposit/withdraw/transfer |

For the demo app, use `apps/demo/.env.local` (see `.env.example` at repo root).

## License

MIT
