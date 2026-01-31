import { Connection, PublicKey } from "@solana/web3.js";
import type { Config } from "./config.js";

/**
 * Privacy client for Solana (uses @solana/web3.js Connection)
 */
export class PrivacyClient {
  readonly connection: Connection;

  constructor(config: Config) {
    this.connection = new Connection(config.rpcUrl);
  }

  /**
   * Get balance in lamports for a public key.
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    return this.connection.getBalance(publicKey);
  }
}
