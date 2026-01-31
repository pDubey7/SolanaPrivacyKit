import { getDefaultClient } from "./client.js";

/**
 * Verify a ZK proof against public inputs (uses client backend).
 */
export async function verifyZKProof(
  proof: string | Buffer,
  publicInputs: string[]
): Promise<boolean> {
  return getDefaultClient().backend.verifyProof(proof, publicInputs);
}
