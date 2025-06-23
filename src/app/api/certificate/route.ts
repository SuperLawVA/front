// app/api/certificate/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { contractId, userQuery } = await req.json();
    const userId = (await cookies()).get("userId");
    console.log({ contractId, userQuery, userId });

    // try {
    //   // Spring Boot의 로그인 API 호출
    //   const res = await axios.post("http://localhost:8080/api/analysis/requset", contractId, {
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const { jwt } = res.data; // Spring Boot가 반환한 JWT

    //   // Next.js의 서버 쿠키에 저장 (HttpOnly 권장)
    //   (await cookies()).set("jwt", jwt, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     path: "/",
    //     maxAge: 60 * 60, // 1시간
    //   });

    // return NextResponse.json({ success: true, contracts }, { status: 200 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
