// app/api/register/emailVerify/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "이메일이 필요합니다." },
        { status: 400 }
      );
    }

    // 👉 여기서 실제 이메일 인증 로직 (예: DB 저장, 인증코드 생성, 이메일 발송 등)
    console.log("이메일 인증 요청:", email);

    return NextResponse.json({
      success: true,
      message: "인증 번호가 메일로 발송되었습니다.",
      verifyCode: "1234",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "서버 오류" },
      { status: 500 }
    );
  }
}
