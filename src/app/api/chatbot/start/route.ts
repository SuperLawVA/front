import { NextRequest, NextResponse } from "next/server";
import backendApi from "@/lib/axios.server";

// 계약서 데이터를 받아서 다른 API로 전달하는 함수
export async function POST(req: NextRequest) {
  try {
    console.log(req);

    const response = await backendApi.post("/chatbot/create", {});

    // 다른 API의 응답을 클라이언트로 전달
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error processing contract data:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
