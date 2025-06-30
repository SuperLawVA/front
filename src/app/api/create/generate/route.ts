import { NextRequest, NextResponse } from "next/server";
import backendApi from "@/lib/axios.server";

// 계약서 데이터를 받아서 다른 API로 전달하는 함수
export async function POST(req: NextRequest) {
  try {
    // 요청 바디에서 데이터 받기
    const { contractData, aggrementRequest } = await req.json();

    // // 다른 API로 POST 요청 보내기
    // const jwt = (await cookies()).get("jwt")?.value;

    const response = await backendApi.post(
      "/contract/generate",
      { contractData, aggrementRequest }
      // {
      //   headers: {
      //     Authorization: `Bearer ${jwt}`, // 예시로 Authorization 헤더 추가
      //     "Content-Type": "application/json", // JSON 데이터 전송
      //   },
      // }
    );

    // 다른 API의 응답을 클라이언트로 전달
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error processing contract data:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
