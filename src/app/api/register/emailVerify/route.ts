// app/api/register/emailVerify/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * /api/email/send POST
 *
 * - 사용자가 입력한 이메일로 인증 코드 전송 요청
 * - Spring Boot 서버로 전달
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    // 1️⃣ 요청 Body 파싱

    // 2️⃣ 백엔드 주소 확인
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("백엔드 URL이 .env에 설정되어 있지 않습니다.");
    }

    // 3️⃣ 백엔드로 요청 전달
    const response = await axios.post(
      `${backendUrl}email/send`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 4️⃣ 응답 성공 처리
    return NextResponse.json({
      success: true,
      message: `${email} 주소로 인증 코드가 발송되었습니다.`,
      data: response.data, // 필요 시 삭제 가능
    });
  } catch (error) {
    console.error("[API EMAIL SEND] Error:", error);

    // 5️⃣ Axios 에러 구체 처리
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      console.log("error.response.data.request");
      console.log(error.request);

      if (status === 409) {
        return NextResponse.json(
          {
            success: false,
            message: `이미 가입된 이메일입니다: ${email}`,
          },
          { status }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: data?.message || "이메일 인증 요청 실패",
        },
        { status }
      );
    }

    // 6️⃣ 기타 예외 처리
    console.log("error");
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message || "서버 내부 오류",
      },
      { status: 500 }
    );
  }
}
