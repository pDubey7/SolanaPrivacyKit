/**
 * SDK configuration for Solana privacy devkit
 */
export interface PrivacyDevkitConfig {
  /** RPC endpoint URL */
  rpcUrl: string;
  /** Optional commitment level */
  commitment?: "processed" | "confirmed" | "finalized";
  /** Optional network (mainnet-beta, devnet, testnet) */
  network?: "mainnet-beta" | "devnet" | "testnet";
}

export const DEFAULT_RPC_URL = "https://api.mainnet-beta.solana.com";

export const DEFAULT_CONFIG: Partial<PrivacyDevkitConfig> = {
  commitment: "confirmed",
  network: "mainnet-beta",
};
