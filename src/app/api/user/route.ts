// app/api/user/route.ts
import backendApi from "@/lib/axios.server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 👉login과 합칠 예정
    // 예: await db.insertUser({ email, passwordHash, name });
    // build용 변수 사용
    console.log(req);
    const user = await backendApi.get("/user");
    const sessions = await backendApi.get("/chatbot");

    return NextResponse.json(
      {
        userName: user.data.userName,
        contractArray: user.data.contracts,
        chats: sessions.data.sessions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(error);
    }
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
