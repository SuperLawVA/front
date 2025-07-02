// app/api/certificate/generate/route.ts
import backendApi from "@/lib/axios.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body");
    console.log(body);

    const response = await backendApi.post("/certificate/sendMail", body);

    console.log("response");
    console.log(response);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
