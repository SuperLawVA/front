// app/api/user/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = (await cookies()).get("userId");
    console.log({ req, userId });

    // try {
    //   // Spring Boot의 로그인 API 호출
    //   const res = await axios.post("http://localhost:8080/api/analysis", userId, {
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const { contract } = res.data; // Spring Boot가 반환한 JWT

    // 여기서는 임시 Mock

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
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "get user data failed" }
      // { message: error.response?.data?.message || "get user data failed" },
      // { status: error.response?.status || 500 }
    );
  }
}
