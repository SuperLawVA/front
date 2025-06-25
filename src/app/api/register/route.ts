// app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const { email, verification, nickname, password } = await req.json();

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("백엔드 URL이 설정되어 있지 않습니다 (.env 확인)");
    }

    // 1️⃣ 인증 코드 검증
    await axios.post(
      `${backendUrl}email/verify`,
      { email, code: verification },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    try {
      // 2️⃣ 회원가입 요청
      const response = await axios.post(
        `${backendUrl}auth/signup`,
        { email, nickname, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // 3️⃣ 응답 결과 전달
      return NextResponse.json(
        {
          success: true,
          message: response.data?.result || "회원가입이 완료되었습니다.",
        },
        { status: 200 }
      );
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError?.response) {
        const status = axiosError.response.status;
        let message = "";
        if (status === 400) {
          message = "잘못된 요청 데이터입니다.";
        } else if (status === 409) {
          message = "이미 가입된 이메일입니다.";
        } else {
          message =
            (axiosError.response.data as { message?: string })?.message ||
            `예상치 못한 상태코드: ${status}`;
        }
        return NextResponse.json(
          {
            success: true,
            message: message,
          },
          { status }
        );
      } else {
        const message = (err as Error).message;
        return NextResponse.json(
          {
            success: false,
            message,
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("[API SIGNUP] Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      console.log("error");
      console.log(error);
      console.log("error.response");
      console.log(error.response);

      if (status === 400) {
        return NextResponse.json(
          {
            success: true,
            message: "인증 코드가 일치하지 않거나 5분이 지나 만료되었습니다.",
          },
          { status }
        );
      }
      if (status === 404) {
        return NextResponse.json(
          {
            success: true,
            message: "인증 코드 수신 이메일이 아닙니다.",
          },
          { status }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "회원가입 중 알 수 없는 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }
  }
}
