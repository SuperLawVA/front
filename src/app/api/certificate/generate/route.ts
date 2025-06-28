// app/api/certificate/generate/route.ts
import backendApi from "@/lib/axios.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { contractId, userQuery } = await req.json();
    // const userId = (await cookies()).get("userId");

    const res = await backendApi.post(
      "/certificate/generate",
      { contractId, userQuery },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("server res!!!!!!!!!!!!!!");
    console.log(res);

    // return NextResponse.json({ success: true, contracts }, { status: 200 });
    return NextResponse.json({ success: true, contractId }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
