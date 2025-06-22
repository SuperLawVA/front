// app/api/create/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[API] Received:", body);

    // 여기서 원하는 로직 실행
    const result = {
      ...body,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
