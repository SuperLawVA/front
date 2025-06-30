// app/api/search/route.ts
import { NextResponse, NextRequest } from "next/server";
import backendApi from "@/lib/axios.server";
import { cookies } from "next/headers";

// 백엔드 서버에서 검색 API 호출
export async function POST(req: NextRequest) {
  try {
    // 1️⃣ 요청 Body 파싱

    const { sendQuery, pageParam } = await req.json();

    if (!sendQuery) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }
    const cookieStore = await cookies();

    const jwt = cookieStore.get("jwt");
    const res = await backendApi.post("/search", {
      sendQuery,
      pageParam,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("444444444444444444444");

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "서버에서 검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
