"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const TOKENS = ["SOL", "USDC"];

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [shieldAmount, setShieldAmount] = useState("");
  const [shieldToken, setShieldToken] = useState("SOL");
  const [shieldResult, setShieldResult] = useState<{ success: boolean; txId?: string; error?: string } | null>(null);
  const [shieldLoading, setShieldLoading] = useState(false);

  const [shieldedBalance, setShieldedBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  async function fetchBalance() {
    if (!publicKey) return;
    setBalanceLoading(true);
    try {
      const res = await fetch(`/api/balance?token=${shieldToken}`);
      const data = await res.json();
      if (data.success) {
        setShieldedBalance(data.balance.toString());
      }
    } catch (e) {
      console.error("Failed to fetch balance:", e);
    } finally {
      setBalanceLoading(false);
    }
  }

  // Poll for balance every 10 seconds if wallet is connected
  useEffect(() => {
    if (publicKey) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    } else {
      setShieldedBalance(null);
      return;
    }
  }, [publicKey, shieldToken]);

  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferResult, setTransferResult] = useState<{ success: boolean; signature?: string; error?: string } | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);

  const [unshieldAmount, setUnshieldAmount] = useState("");
  const [unshieldResult, setUnshieldResult] = useState<{ success: boolean; txId?: string; error?: string } | null>(null);
  const [unshieldLoading, setUnshieldLoading] = useState(false);

  const [proofHex, setProofHex] = useState("");
  const [publicInputs, setPublicInputs] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  async function handleShield() {
    const amount = Number(shieldAmount);
    if (Number.isNaN(amount) || amount <= 0) return;
    setShieldLoading(true);
    setShieldResult(null);
    try {
      const res = await fetch("/api/shield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, token: shieldToken }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setShieldResult({ success: false, error: data.error || "Unknown error from API" });
        return;
      }

      // If backend returns unsignedTransaction (Mainnet/ShadowWire), we must sign it
      if (data.unsignedTransaction) {
        try {
          const txBuffer = Buffer.from(data.unsignedTransaction, "base64");
          // Try VersionedTransaction first (standard for modern Solana apps), fallback to legacy
          let tx;
          try {
            tx = VersionedTransaction.deserialize(new Uint8Array(txBuffer));
          } catch (err) {
            tx = Transaction.from(txBuffer);
          }

          const signature = await sendTransaction(tx as any, connection);
          await connection.confirmTransaction(signature, "confirmed");

          setShieldResult({ success: true, txId: signature });
          fetchBalance(); // Refresh balance after success
        } catch (sigErr) {
          console.error("Signing failed:", sigErr);
          setShieldResult({
            success: false,
            error: sigErr instanceof Error ? "Signing failed: " + sigErr.message : "Transaction signing failed"
          });
        }
      } else {
        // Mock backend or other result
        setShieldResult(data);
      }
    } catch (e) {
      setShieldResult({ success: false, error: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setShieldLoading(false);
    }
  }

  async function handleTransfer() {
    const amount = Number(transferAmount);
    if (!transferRecipient.trim() || Number.isNaN(amount) || amount <= 0) return;
    setTransferLoading(true);
    setTransferResult(null);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: transferRecipient.trim(), amount }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setTransferResult({ success: false, error: data.error || "Unknown error" });
      } else {
        setTransferResult(data);
      }
    } catch (e) {
      setTransferResult({ success: false, error: e instanceof Error ? e.message : "Transfer failed" });
    } finally {
      setTransferLoading(false);
    }
  }

  async function handleVerify() {
    if (!proofHex.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: proofHex.trim(),
          publicInputs: publicInputs ? publicInputs.split(",").map((s) => s.trim()) : [],
        }),
      });
      const data = await res.json();
      setVerifyResult(res.ok && data.valid === true);
    } catch (e) {
      setVerifyResult(false);
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleUnshield() {
    const amount = Number(unshieldAmount);
    if (Number.isNaN(amount) || amount <= 0) return;
    setUnshieldLoading(true);
    setUnshieldResult(null);
    try {
      // Note: We need to implement /api/unshield first
      const res = await fetch("/api/unshield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, token: "SOL" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setUnshieldResult({ success: false, error: data.error || "Unknown error" });
        return;
      }

      // If backend returns unsignedTransaction (Mainnet/ShadowWire), sign it
      if (data.unsignedTransaction) {
        try {
          const txBuffer = Buffer.from(data.unsignedTransaction, "base64");
          let tx;
          try {
            tx = VersionedTransaction.deserialize(new Uint8Array(txBuffer));
          } catch (err) {
            tx = Transaction.from(txBuffer);
          }

          const signature = await sendTransaction(tx as any, connection);
          await connection.confirmTransaction(signature, "confirmed");

          setUnshieldResult({ success: true, txId: signature });
          fetchBalance(); // Refresh balance after success
        } catch (sigErr) {
          console.error("Signing failed:", sigErr);
          setUnshieldResult({
            success: false,
            error: sigErr instanceof Error ? "Signing failed: " + sigErr.message : "Transaction signing failed"
          });
        }
      } else {
        setUnshieldResult(data);
      }
    } catch (e) {
      setUnshieldResult({ success: false, error: e instanceof Error ? e.message : "Unshield failed" });
    } finally {
      setUnshieldLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Solana Privacy Devkit</h1>
      <p className="text-slate-400 text-sm">Devnet only. Connect Phantom and use the sections below.</p>

      {/* Connect wallet */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Connect wallet</h2>
        <WalletMultiButton className="!bg-violet-600 hover:!bg-violet-500 !rounded-lg" />
      </section>

      {/* Shield amount */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Shield amount</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Amount</label>
            <input
              type="text"
              value={shieldAmount}
              onChange={(e) => setShieldAmount(e.target.value)}
              placeholder="0"
              className="w-32 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Token</label>
            <select
              value={shieldToken}
              onChange={(e) => setShieldToken(e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
            >
              {TOKENS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleShield}
            disabled={shieldLoading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:opacity-50"
          >
            {shieldLoading ? "Shielding…" : "Shield"}
          </button>
        </div>
        {shieldResult && (
          <p className="mt-3 text-sm text-slate-300">
            {shieldResult.success ? (
              <>Success {shieldResult.txId && <>· txId: {shieldResult.txId}</>}</>
            ) : (
              <span className="text-red-400">
                {shieldResult.error ? `Error: ${shieldResult.error}` : "Shield failed"}
              </span>
            )}
          </p>
        )}
      </section>

      {/* Shielded balance */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Shielded balance</h2>
        <p className="text-slate-300 text-lg">
          {shieldedBalance != null
            ? `${shieldedBalance} ${shieldToken}`
            : balanceLoading
              ? "Loading..."
              : "Not loaded — use backend/API for real balance."}
        </p>
        {publicKey && (
          <button
            onClick={fetchBalance}
            className="mt-2 text-xs text-violet-400 hover:text-violet-300"
          >
            Refresh balance
          </button>
        )}
      </section>

      {/* Private transfer */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Private transfer</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Recipient address</label>
            <input
              type="text"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              placeholder="Base58 address"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Amount</label>
            <input
              type="text"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0"
              className="w-32 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleTransfer}
            disabled={transferLoading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:opacity-50"
          >
            {transferLoading ? "Sending…" : "Send private transfer"}
          </button>
        </div>
        {transferResult && (
          <p className="mt-3 text-sm text-slate-300">
            {transferResult.success ? (
              <>Success {transferResult.signature && <>· sig: {transferResult.signature}</>}</>
            ) : (
              "Transfer failed"
            )}
          </p>
        )}
      </section>

      {/* Verification Result */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Verify proof</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Proof (hex)</label>
            <textarea
              value={proofHex}
              onChange={(e) => setProofHex(e.target.value)}
              placeholder="deadbeef..."
              rows={3}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Public inputs (comma-separated, optional)</label>
            <input
              type="text"
              value={publicInputs}
              onChange={(e) => setPublicInputs(e.target.value)}
              placeholder=""
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={verifyLoading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 disabled:opacity-50"
          >
            {verifyLoading ? "Verifying…" : "Verify"}
          </button>
        </div>
        {verifyResult !== null && (
          <p className={`mt-3 text-sm ${verifyResult ? "text-green-400" : "text-red-400"}`}>
            {verifyResult ? "Proof verified successfully." : "Proof verification failed."}
          </p>
        )}
      </section>

      {/* Unshield Section */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Unshield (Withdraw)</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Amount</label>
            <input
              type="text"
              value={unshieldAmount}
              onChange={(e) => setUnshieldAmount(e.target.value)}
              placeholder="0"
              className="w-32 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleUnshield}
            disabled={unshieldLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500 disabled:opacity-50"
          >
            {unshieldLoading ? "Unshielding…" : "Unshield"}
          </button>
        </div>
        {unshieldResult && (
          <p className="mt-3 text-sm text-slate-300">
            {unshieldResult.success ? (
              <>Success {unshieldResult.txId && <>· txId: {unshieldResult.txId}</>}</>
            ) : (
              <span className="text-red-400">
                {unshieldResult.error ? `Error: ${unshieldResult.error}` : "Unshield failed"}
              </span>
            )}
          </p>
        )}
      </section>
    </main>
  );
}
