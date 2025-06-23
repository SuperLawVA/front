// app/api/register/emailVerify/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  console.log({ email, password, name });

  try {
    // 👉 여기에 실제 회원가입 로직 작성 (DB 저장 등)
    // 예: await db.insertUser({ email, passwordHash, name });
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
