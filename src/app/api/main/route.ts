// app/api/main/upload.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();
  try {
    // 👉login과 합칠 예정
    // 예: await db.insertUser({ email, passwordHash, name });
    console.log(userId);

    return NextResponse.json({
      success: true,
      userName: true,
      notification: true,
      contract: null,
      recentChat: null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
