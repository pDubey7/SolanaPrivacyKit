import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solana Privacy Devkit Demo",
  description: "Demo app for the Solana Privacy Devkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
