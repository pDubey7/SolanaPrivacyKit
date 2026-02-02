import { NextResponse } from "next/server";
import { getShieldedBalance } from "@privacy-devkit/sdk";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token") || "SOL";

        const balance = await getShieldedBalance(token);
        return NextResponse.json({ success: true, balance });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to fetch balance";
        console.error("API Balance Error:", e);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
