// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
import backendApi from "@/lib/axios.server";
import axios from "axios";

/**
 * POST 함수:
 * 클라이언트가 /api/login으로 POST 요청 보내면 실행됨.
 * Spring Boot로 로그인 요청 보내고 JWT를 받아서 서버 쿠키에 저장한다.
 */

export async function POST(req: NextRequest) {
  // params.contractId 로 접근 가능
  try {
    // Spring Boot의 로그인 API 호출
    const { mongoSessionId, message } = await req.json();

    const response = await backendApi.post(
      "/chatbot",
      { mongoSessionId, message },
      { headers: { "Content-Type": "application/json" } }
    );
    const answer = response.data;

    // 4️⃣ 응답 성공 처리
    return NextResponse.json(answer);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || error.message || "failed";
      return NextResponse.json({ message }, { status });
    }
  }
}
