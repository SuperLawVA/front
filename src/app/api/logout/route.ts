// ✅ 서버: 쿠키 삭제 API
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 쿠키 제거 (token 이름 맞게!)
  (await cookies()).set("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // 즉시 만료!
  });

  return NextResponse.json({ message: "Logged out" });
}
