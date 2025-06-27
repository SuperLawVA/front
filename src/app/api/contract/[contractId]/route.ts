// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
import { cookies } from "next/headers";
import backendApi from "@/lib/axios.server";

/**
 * POST 함수:
 * 클라이언트가 /api/login으로 POST 요청 보내면 실행됨.
 * Spring Boot로 로그인 요청 보내고 JWT를 받아서 서버 쿠키에 저장한다.
 */

export async function POST(
  req: NextRequest,
  context: { params: { contractId: string } }
) {
  const { contractId } = context.params; // ✅ await 필요 없음
  console.log("params");
  // console.log(params);
  // const contractId = await params.contractId;
  console.log("contractId");
  console.log(contractId);

  // try {
  //   // Spring Boot의 로그인 API 호출
  //   const res = await axios.post("http://localhost:8080/api/login", body, {
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   const { token } = res.data; // Spring Boot가 반환한 JWT

  //   // Next.js의 서버 쿠키에 저장 (HttpOnly 권장)
  //   (await cookies()).set("jwt", token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     path: "/",
  //     maxAge: 60 * 60, // 1시간
  //   });
  try {
    // Spring Boot의 로그인 API 호출

    const body = await req.json();
    const contracts = await backendApi.post("/contract", {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json({ message: "Login success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: (error as Error).message || "Login failed",
    });
  }
}
