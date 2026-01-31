#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("privacy-devkit")
  .description("CLI for Solana Privacy Devkit")
  .version("1.0.0");

program
  .command("config")
  .description("Show or set configuration")
  .option("-r, --rpc <url>", "RPC endpoint URL")
  .option("-n, --network <name>", "Network: mainnet-beta | devnet | testnet")
  .action((options) => {
    if (options.rpc) console.log("RPC:", options.rpc);
    if (options.network) console.log("Network:", options.network);
    if (!options.rpc && !options.network) {
      console.log("Usage: privacy-devkit config --rpc <url> [--network <name>]");
    }
  });

program
  .command("transfer")
  .description("Create a privacy-preserving transfer")
  .requiredOption("-f, --from <address>", "Sender address")
  .requiredOption("-t, --to <address>", "Recipient address")
  .requiredOption("-a, --amount <lamports>", "Amount in lamports")
  .option("-m, --memo <text>", "Optional memo")
  .action((options) => {
    console.log("Transfer:", {
      from: options.from,
      to: options.to,
      amount: options.amount,
      memo: options.memo,
    });
  });

program.parse();
