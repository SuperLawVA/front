// app/api/user/route.ts
import backendApi from "@/lib/axios.server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 👉login과 합칠 예정
    // 예: await db.insertUser({ email, passwordHash, name });
    // build용 변수 사용
    const user = await backendApi.get("/more");
    // const sessions = await backendApi.get("/chatbot");

    // return NextResponse.json(contracts.data, { status: 200 });
    // try {
    //   // Spring Boot의 로그인 API 호출
    //   const res = await axios.post("http://localhost:8080/api/analysis", userId, {
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const { contract } = res.data; // Spring Boot가 반환한 JWT
    // 1. contracts 배열을 Map으로 변환 (id → title)
    const contractMap = new Map(
      user.data.contracts.map((c: { _id: string; contractTitle: string }) => [
        c._id,
        c.contractTitle,
      ])
    );

    // 2. analysises에 title 추가
    // const analysisesWithTitle = user.data.analysises.map(
    //   (a: { _id: string; contractId: string }) => ({
    //     ...a,
    //     contractTitle: contractMap.get(a.contractId) || "삭제된 계약서",
    //   })
    // );
    const analysisesWithTitle = user.data.analysises.map(
      (a: { _id: string; contractId: string }) => {
        console.log(contractMap.get(a.contractId));

        return {
          ...a,
          contractTitle: contractMap.get(a.contractId) || "삭제된 계약서",
        };
      }
    );

    return NextResponse.json(
      {
        userName: user.data.userName,
        email: user.data.email,
        contractArray: user.data.contracts,
        analysisArray: analysisesWithTitle,
        certificateArray: user.data.certificates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(error);
    }
    return NextResponse.json({ success: false }, { status: 500 });

    // return NextResponse.json(
    //   { message: (error as Error).message || "get user data failed" }
    //   // { message: error.response?.data?.message || "get user data failed" },
    //   // { status: error.response?.status || 500 }

    // );
  }
}
