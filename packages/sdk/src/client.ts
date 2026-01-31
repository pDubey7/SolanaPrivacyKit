import { Connection, PublicKey } from "@solana/web3.js";
import type { Config } from "./config.js";
import { loadFromEnv } from "./config.js";
import type { PrivateTransferProvider, ZKVerifier, PrivacyBackend } from "./interfaces.js";
import { MockBackend } from "./backends/mock.js";

export type PrivacyBackendInstance = PrivateTransferProvider & ZKVerifier;

function createBackend(name: PrivacyBackend): PrivacyBackendInstance {
  switch (name) {
    case "mock":
      return new MockBackend();
    case "shadowwire":
    case "arcium":
      throw new Error(`Backend "${name}" is not implemented yet. Use "mock".`);
    default:
      throw new Error(`Unknown backend: ${name}`);
  }
}

let defaultClient: PrivacyClient | null = null;

/**
 * Privacy client for Solana (uses @solana/web3.js Connection).
 * Has a backend (PrivateTransferProvider & ZKVerifier); defaults to MockBackend.
 */
export class PrivacyClient {
  readonly connection: Connection;
  backend: PrivacyBackendInstance;

  constructor(config: Config) {
    this.connection = new Connection(config.rpcUrl);
    this.backend = new MockBackend();
  }

  /**
   * Set the privacy backend by name.
   */
  setBackend(backend: PrivacyBackend): void {
    this.backend = createBackend(backend);
  }

  /**
   * Get balance in lamports for a public key.
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    return this.connection.getBalance(publicKey);
  }
}

/**
 * Return the default client (singleton, lazy-initialized with loadFromEnv).
 * Used by transfers.ts and proofs.ts so standalone functions use the client's backend.
 */
export function getDefaultClient(): PrivacyClient {
  if (defaultClient == null) {
    defaultClient = new PrivacyClient(loadFromEnv());
  }
  return defaultClient;
}

/**
 * Set the default client (e.g. for testing or after custom config).
 */
export function setDefaultClient(client: PrivacyClient | null): void {
  defaultClient = client;
}
