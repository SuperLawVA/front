// app/api/user/route.ts
import backendApi from "@/lib/axios.server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("test run!!!!!!!!!");

    // 👉login과 합칠 예정
    // 예: await db.insertUser({ email, passwordHash, name });
    // build용 변수 사용
    const user = await backendApi.get("/test");

    // return NextResponse.json(contracts.data, { status: 200 });
    // try {
    //   // Spring Boot의 로그인 API 호출
    //   const res = await axios.post("http://localhost:8080/api/analysis", userId, {
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const { contract } = res.data; // Spring Boot가 반환한 JWT

    // 여기서는 임시 Mock
    console.log("user");
    console.log(user);
    console.log("user.data");
    console.log(user.data);

    return NextResponse.json({ success: true }, { status: 200 });
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
