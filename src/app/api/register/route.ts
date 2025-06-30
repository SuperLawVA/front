// app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import backendApi from "@/lib/axios.server";

export async function POST(req: NextRequest) {
  try {
    const { email, verification, nickname, password } = await req.json();

    // 2️⃣ 회원가입 요청
    const response = await backendApi.post(
      "/auth/register",
      { email, nickname, password, emailVerifyCode: verification },
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
        message: response.data?.message || "회원가입이 완료되었습니다.",
      },
      { status: 200 }
    );
  } catch (err) {
    const axiosError = err as AxiosError;

    if (axiosError?.response) {
      const status = axiosError.response.status;
      const { message, result } = axiosError.response.data as {
        message: string;
        result: string;
      };
      return NextResponse.json(
        {
          success: true,
          message,
          result,
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
}
