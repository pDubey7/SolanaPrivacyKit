/**
 * SDK configuration for Solana privacy devkit.
 * This project is devnet-only; mainnet is not supported.
 */
export interface Config {
  /** RPC endpoint URL (devnet) */
  rpcUrl: string;
  /** Network: always "devnet" */
  network: "devnet";
}

export const DEFAULT_RPC_URL = "https://api.devnet.solana.com";
export const DEFAULT_NETWORK = "devnet" as const;

/**
 * Load configuration from environment variables.
 * Uses process.env.RPC_URL for RPC URL; network is always devnet.
 * NETWORK is ignored — this SDK is devnet-only.
 */
export function loadFromEnv(): Config {
  const rpcUrl = process.env.RPC_URL ?? DEFAULT_RPC_URL;
  return { rpcUrl, network: "devnet" };
}
