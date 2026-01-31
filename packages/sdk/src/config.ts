/**
 * SDK configuration for Solana privacy devkit.
 * Supports both devnet (testing) and mainnet-beta (production with ShadowWire).
 */
export interface Config {
  /** RPC endpoint URL */
  rpcUrl: string;
  /** Network: "devnet" for testing, "mainnet-beta" for production */
  network: "devnet" | "mainnet-beta";
  /** ShadowWire API key (optional; when set, client can use setBackend('shadowwire')) */
  shadowwireApiKey?: string;
  /** ShadowWire wallet address for deposit/withdraw/transfer (required when using shadowwire backend) */
  shadowwireWallet?: string;
}

export const DEFAULT_RPC_URL = "https://api.devnet.solana.com";
export const DEFAULT_NETWORK = "devnet" as const;
export const MAINNET_RPC_URL = "https://api.mainnet-beta.solana.com";

/**
 * Load configuration from environment variables.
 * Uses process.env.RPC_URL for RPC URL.
 * Uses process.env.NETWORK for network selection (defaults to devnet for safety).
 * SHADOWWIRE_API_KEY and SHADOWWIRE_WALLET for ShadowWire backend.
 */
export function loadFromEnv(): Config {
  const network = (process.env.NETWORK === "mainnet-beta" ? "mainnet-beta" : "devnet") as "devnet" | "mainnet-beta";
  const rpcUrl = process.env.RPC_URL ?? (network === "mainnet-beta" ? MAINNET_RPC_URL : DEFAULT_RPC_URL);
  const shadowwireApiKey = process.env.SHADOWWIRE_API_KEY;
  const shadowwireWallet = process.env.SHADOWWIRE_WALLET;
  return {
    rpcUrl,
    network,
    ...(shadowwireApiKey ? { shadowwireApiKey } : {}),
    ...(shadowwireWallet ? { shadowwireWallet } : {}),
  };
}
