import { DemoCard } from "@/components/DemoCard";

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Solana Privacy Devkit</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        Demo app for the Solana Privacy Devkit SDK
      </p>
      <DemoCard />
    </main>
  );
}
