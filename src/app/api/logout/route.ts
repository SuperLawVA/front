// app/api/logout/route.ts
// ✅ 서버: 쿠키 삭제 API
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST() {
  const cookieStore = await cookies();
  try {
    // 2️⃣ Spring Boot로 로그아웃 요청 (백엔드 주소는 .env에서 관리)
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("백엔드 URL이 설정되어 있지 않습니다 (.env 확인).");
    }
    const accessToken = cookieStore.get("jwt")?.value;
    console.log('cookieStore.get("jwt")?.value');
    console.log(accessToken);
    console.log('cookieStore.get("jwt")?.value');
    const response = await axios.post(
      `${backendUrl}auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // Authorization: `Bearer ${cookieStore.get("jwt")?.value}`,
        },
      }
    );

    const { message } = response.data;

    cookieStore.delete("jwt");
    cookieStore.delete("userId");
    console.log(response);
    // 5️⃣ 클라이언트로 로그아웃 성공 응답
    return NextResponse.json(
      { success: true, message },
      { status: response.status }
    );
  } catch (error) {
    console.error("[API LOGOUT] Error:", error);
    // 6️⃣ Axios 에러 구체 처리
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      if (status === 400) {
        cookieStore.delete("jwt");
        cookieStore.delete("userId");
        console.log(error);
        console.log(error.response);
        return NextResponse.json(
          {
            success: false,
            message: error.response.data.message,
          },
          { status }
        );
      } else if (status === 401) {
        cookieStore.delete("jwt");
        cookieStore.delete("userId");
        console.log(error);
        console.log(error.response);
        return NextResponse.json(
          {
            success: false,
            message: error.response.data.message,
          },
          { status }
        );
      }
    }

    // 7️⃣ 그 외 예기치 못한 오류
    console.log(error);
    return NextResponse.json(
      { success: false, message: "서버 내부 오류가 발생했습니다.", error },
      { status: 500 }
    );
  }
}
