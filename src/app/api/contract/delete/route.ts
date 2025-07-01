// app/api/analysis/generate/route.ts
import backendApi from "@/lib/axios.server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { _id } = await req.json();

    const response = await backendApi.post("/contract/delete", { _id });

    // // 4️⃣ 응답 성공 처리
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || "failed";
      return NextResponse.json({ message }, { status });
    } else {
      // ✅ AxiosError가 아닌 경우도 return
      return NextResponse.json(
        { message: "서버 오류", error: String(error) },
        { status: 500 }
      );
    }
  }
}
