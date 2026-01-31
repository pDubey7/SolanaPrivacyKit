/**
 * Proof types and utilities for privacy-preserving proofs
 */
export interface ProofInput {
  /** Public inputs for the proof */
  publicInputs: string[];
  /** Private inputs (not revealed) */
  privateInputs?: string[];
}

export interface ProofResult {
  /** Serialized proof bytes (base64) */
  proof: string;
  /** Public inputs revealed with the proof */
  publicInputs: string[];
}

/**
 * Placeholder for proof generation/verification
 */
export function createProofInput(publicInputs: string[]): ProofInput {
  return { publicInputs };
}
