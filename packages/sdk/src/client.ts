import type { PrivacyDevkitConfig } from "./config.js";

/**
 * Privacy devkit client for Solana
 */
export class PrivacyDevkitClient {
  private config: PrivacyDevkitConfig;

  constructor(config: PrivacyDevkitConfig) {
    this.config = config;
  }

  getRpcUrl(): string {
    return this.config.rpcUrl;
  }

  getCommitment() {
    return this.config.commitment ?? "confirmed";
  }

  getNetwork() {
    return this.config.network ?? "mainnet-beta";
  }
}
