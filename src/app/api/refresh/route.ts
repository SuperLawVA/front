import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Spring Boot에 refresh 요청
    const res = await axios.get("http://localhost:8080/api/refreshToken", {
      headers: {
        Cookie: `refreshToken=${(await cookies()).get("refreshToken")?.value}`,
      },
      withCredentials: true,
    });

    const { token } = res.data;

    (await cookies()).set("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ message: "Token refreshed" });
  } catch (error) {
    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
  }
}
