#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { readFileSync, existsSync } from "fs";
import {
  shieldAmount,
  createPrivateTransfer,
  verifyZKProof,
  loadFromEnv,
  DEFAULT_RPC_URL,
  type Config,
} from "@privacy-devkit/sdk";
import { loadConfig, writeConfig } from "./config-loader.js";

const program = new Command();

function getConfig(opts: { rpcUrl?: string; network?: string }): Config {
  const file = loadConfig();
  const env = loadFromEnv();
  const rpcUrl = opts.rpcUrl ?? file?.rpcUrl ?? env.rpcUrl ?? DEFAULT_RPC_URL;
  return { rpcUrl, network: "devnet" };
}

program
  .name("privacy")
  .description("Solana Privacy Devkit CLI (devnet only)")
  .version("1.0.0");

program
  .command("init")
  .description("Create .privacy/config.json with rpcUrl and network")
  .option("-r, --rpc-url <url>", "Devnet RPC URL", DEFAULT_RPC_URL)
  .option("-n, --network <name>", "Network (devnet only)", "devnet")
  .action((opts) => {
    const rpcUrl = opts.rpcUrl ?? DEFAULT_RPC_URL;
    const network = (opts.network === "devnet" ? "devnet" : "devnet") as "devnet";
    const dir = process.cwd();
    writeConfig(dir, { rpcUrl, network });
    console.log(chalk.green("Created"), chalk.cyan(".privacy/config.json"));
    console.log(chalk.gray("  rpcUrl:"), rpcUrl);
    console.log(chalk.gray("  network:"), network);
  });

program
  .command("shield <amount> <token>")
  .description("Shield amount of token (calls SDK shieldAmount)")
  .option("--rpc-url <url>", "Override RPC URL")
  .option("--network <name>", "Override network (devnet only)")
  .action(async (amountStr: string, token: string, opts: { rpcUrl?: string; network?: string }) => {
    const amount = Number(amountStr);
    if (Number.isNaN(amount) || amount <= 0) {
      console.error(chalk.red("Error: amount must be a positive number"));
      process.exit(1);
    }
    void getConfig(opts);
    try {
      const result = await shieldAmount(amount, token);
      console.log(chalk.green("Shield result:"));
      console.log(chalk.gray("  success:"), result.success);
      if (result.txId) console.log(chalk.gray("  txId:"), result.txId);
      if (result.commitment) console.log(chalk.gray("  commitment:"), result.commitment);
    } catch (err) {
      console.error(chalk.red("Error:"), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command("transfer <recipient> <amount>")
  .description("Create private transfer (calls SDK createPrivateTransfer)")
  .option("--rpc-url <url>", "Override RPC URL")
  .option("--network <name>", "Override network (devnet only)")
  .action(async (recipient: string, amountStr: string, opts: { rpcUrl?: string; network?: string }) => {
    const amount = Number(amountStr);
    if (Number.isNaN(amount) || amount <= 0) {
      console.error(chalk.red("Error: amount must be a positive number"));
      process.exit(1);
    }
    void getConfig(opts);
    try {
      const result = await createPrivateTransfer(recipient, amount);
      console.log(chalk.green("Transfer result:"));
      console.log(chalk.gray("  success:"), result.success);
      if (result.signature) console.log(chalk.gray("  signature:"), result.signature);
      if (result.slot != null) console.log(chalk.gray("  slot:"), result.slot);
    } catch (err) {
      console.error(chalk.red("Error:"), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command("verify <proof>")
  .description("Verify ZK proof (proof as hex string or file path)")
  .option("--public-inputs <inputs>", "Comma-separated public inputs (optional)")
  .option("--rpc-url <url>", "Override RPC URL")
  .option("--network <name>", "Override network (devnet only)")
  .action(async (proofArg: string, opts: { publicInputs?: string; rpcUrl?: string; network?: string }) => {
    void getConfig(opts);
    let proof: string | Buffer;
    if (existsSync(proofArg)) {
      proof = readFileSync(proofArg);
    } else {
      proof = proofArg;
    }
    const publicInputs = opts.publicInputs ? opts.publicInputs.split(",").map((s) => s.trim()) : [];
    try {
      const ok = await verifyZKProof(proof, publicInputs);
      if (ok) {
        console.log(chalk.green("Proof verified successfully."));
      } else {
        console.log(chalk.red("Proof verification failed."));
        process.exit(1);
      }
    } catch (err) {
      console.error(chalk.red("Error:"), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parse();
