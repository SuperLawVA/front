// app/api/analysis/route.ts
import backendApi from "@/lib/axios.server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { analysisId } = await req.json();
    const response = await backendApi.post("/analysis", { analysisId });
    const analysis = response.data;

    // 4️⃣ 응답 성공 처리
    return NextResponse.json(analysis);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || "failed";

      return NextResponse.json({ message }, { status });
    }
  }
}
