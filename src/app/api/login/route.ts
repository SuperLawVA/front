// app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import backendApi from "@/lib/axios.server";

/**
 * /api/login POST
 *
 * - 클라이언트 로그인 요청 처리
 * - 백엔드로 전달 → JWT 응답 → 쿠키 저장 (HttpOnly)
 * - 에러 상황 처리 (400, 404, 기타)
 */
export async function POST(req: NextRequest) {
  try {
    // 1️⃣ 요청 Body 파싱
    const body = await req.json();
    const response = await backendApi.post("/auth/login", body, {
      headers: { "Content-Type": "application/json" },
    });

    // 3️⃣ 응답에서 JWT와 사용자 정보 추출
    const { token: jwt } = response.data;
    const status = response.status;

    // 4️⃣ JWT와 userId를 HttpOnly 쿠키로 설정
    const cookieStore = await cookies();

    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // maxAge: 60 * 60, // 1시간
    });

    // 5️⃣ 클라이언트로 로그인 성공 응답
    return NextResponse.json({ success: true }, { status });
  } catch (error) {
    console.error("[API LOGIN] Error:", error);
    // 6️⃣ Axios 에러 구체 처리
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      if (status === 404) {
        return NextResponse.json(
          {
            success: false,
            message: "가입되지 않은 이메일입니다.",
            // message: data?.message,
          },
          { status }
        );
      } else if (status === 401) {
        return NextResponse.json(
          {
            success: false,
            message:
              "비밀번호가 일치하지 않습니다.\n비밀번호는 8자 이상이며, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.",
          },
          { status }
        );
      }
    }

    // 7️⃣ 그 외 예기치 못한 오류
    return NextResponse.json(
      { success: false, message: "서버 내부 오류가 발생했습니다.", error },
      { status: 500 }
    );
  }
}
