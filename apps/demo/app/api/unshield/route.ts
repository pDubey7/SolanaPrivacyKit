import { NextResponse } from "next/server";
import { unshieldAmount } from "@privacy-devkit/sdk";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, token } = body as { amount?: number; token?: string };

        if (amount == null || typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid amount" },
                { status: 400 }
            );
        }

        // Call the SDK to unshield
        const result = await unshieldAmount(amount, token ?? "SOL");
        return NextResponse.json(result);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unshield failed";
        console.error("API Unshield Error:", e);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
