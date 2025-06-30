// app/api/analysis/generate/route.ts
import backendApi from "@/lib/axios.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { contractId } = await req.json();
    const response = await backendApi.post("/analysis/generate", contractId, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
