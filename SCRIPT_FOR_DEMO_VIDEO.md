# Script for Demo Video (Hackathon)

Use this as a loose script to record a short demo of the Privacy Devkit.

---

## 1. Intro (10–15 sec)

- "This is the Solana Privacy Devkit: SDK, CLI, and a demo app, all on devnet."
- Show repo: `packages/sdk`, `packages/cli`, `apps/demo`, `programs/`.

## 2. Install & build (20–30 sec)

```bash
npm install
npm run build
```

- "We use npm workspaces; one install and one build for the whole repo."

## 3. CLI (30–45 sec)

```bash
npm run cli -- init
npm run cli -- shield 100 SOL
npm run cli -- transfer <some-devnet-address> 50
npm run cli -- verify deadbeef
```

- "CLI supports init, shield, private transfer, and proof verification. You can pass --backend shadowwire when you have ShadowWire configured."

## 4. Demo app (45–60 sec)

```bash
npm run dev
```

- Open http://localhost:3000.
- "Connect Phantom on devnet."
- "Shield an amount and a token; the UI calls our API, which uses the SDK."
- "Private transfer: paste a recipient and amount, then send."
- "Verify proof: paste a hex proof and optional public inputs; result comes from the verify API."

## 5. Solana program (optional, 20–30 sec)

- "We ship a minimal Anchor program in `programs/privacy_devkit`. You can build and deploy to devnet with Anchor CLI."
- Show `programs/privacy_devkit/src/lib.rs` and mention `anchor build` and `anchor deploy --provider.cluster devnet`.

## 6. Outro (5–10 sec)

- "Everything is devnet-only, MIT licensed. Thanks for watching."

---

**Total target:** about 2–3 minutes. Adjust sections to fit your time limit.
