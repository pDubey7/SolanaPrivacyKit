/**
 * SDK configuration for Solana privacy devkit
 */
export interface Config {
  /** RPC endpoint URL */
  rpcUrl: string;
  /** Network: devnet | mainnet */
  network: "devnet" | "mainnet";
}

export const DEFAULT_RPC_URL = "https://api.devnet.solana.com";
export const DEFAULT_NETWORK = "devnet" as const;

/**
 * Load configuration from environment variables.
 * Uses process.env.RPC_URL and process.env.NETWORK.
 */
export function loadFromEnv(): Config {
  const rpcUrl = process.env.RPC_URL ?? DEFAULT_RPC_URL;
  const rawNetwork = process.env.NETWORK ?? DEFAULT_NETWORK;
  const network = rawNetwork === "devnet" ? "devnet" : "mainnet";
  return { rpcUrl, network };
}
