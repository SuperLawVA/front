// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

/**
 * POST 함수:
 * 클라이언트가 /api/login으로 POST 요청 보내면 실행됨.
 * Spring Boot로 로그인 요청 보내고 JWT를 받아서 서버 쿠키에 저장한다.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // try {
  //   // Spring Boot의 로그인 API 호출
  //   const res = await axios.post("http://localhost:8080/api/login", body, {
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
  try {
    // Spring Boot의 로그인 API 호출
    // const res = await axios.post("http://localhost:8080/api/login", body, {
    //   headers: { "Content-Type": "application/json" },
    // });
    if (/\D+@\D+/.test(body.email) || !body.email) {
      throw new Error(`1@1.1 입력`);
    }
    const jwt = "jwtUser"; // Spring Boot가 반환한 JWT
    // sessionStorage.setItem("userId", jwt);

    // Next.js의 서버 쿠키에 저장 (HttpOnly 권장)
    (await cookies()).set("jwt", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // maxAge: 60 * 60, // 1시간
      maxAge: 60 * 60 * 60, // 1시간
    });
    // Next.js의 서버 쿠키에 저장 (HttpOnly 권장)
    return NextResponse.json(
      {
        token: "tokenValue",
        userName: "아무개",
        notification: [0, 1, 2],
        contractArray: [
          {
            _id: "asdasd",
            title: "월세 임대차 계약서",
            state: "진행중",
            address: "서울시 강남구 테헤란로 123",
            createdAt: "2025.03.22",
          },
        ],
        recentChat: [
          { _id: "1", title: "집 주인이 보증금 안 돌려줘요." },
          { _id: "2", title: "전입 신고 방법 알려줘" },
          { _id: "3", title: "묵시적 갱신이 뭔가요" },
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
