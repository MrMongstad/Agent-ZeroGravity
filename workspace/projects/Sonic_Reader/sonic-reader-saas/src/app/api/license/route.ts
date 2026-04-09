import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        // In a real app, verify subscription status with Stripe/Supabase here
        const prefix = "SNK";
        const type = "ELITE";
        const randomPart = uuidv4().split("-")[0].toUpperCase();
        const licenseKey = `${prefix}-${type}-${randomPart}-${Math.floor(1000 + Math.random() * 9000)}`;

        return NextResponse.json({ licenseKey });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
