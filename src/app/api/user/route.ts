// app/api/user/route.ts
import backendApi from "@/lib/axios.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 👉login과 합칠 예정
    // 예: await db.insertUser({ email, passwordHash, name });
    // build용 변수 사용
    const contracts = await backendApi.get("/contract");

    // return NextResponse.json(contracts.data, { status: 200 });
    // try {
    //   // Spring Boot의 로그인 API 호출
    //   const res = await axios.post("http://localhost:8080/api/analysis", userId, {
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const { contract } = res.data; // Spring Boot가 반환한 JWT

    // 여기서는 임시 Mock

    return NextResponse.json(
      {
        userName: contracts.data.userName,
        notification: [0, 1, 2],
        contractArray: contracts.data.contracts,
        recentChat: [
          { _id: "1", title: "집 주인이 보증금 안 돌려줘요." },
          { _id: "2", title: "전입 신고 방법 알려줘" },
          { _id: "3", title: "묵시적 갱신이 뭔가요" },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });

    // return NextResponse.json(
    //   { message: (error as Error).message || "get user data failed" }
    //   // { message: error.response?.data?.message || "get user data failed" },
    //   // { status: error.response?.status || 500 }

    // );
  }
}
