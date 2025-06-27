// app/api/analysis/route.ts
// import { cookies } from "next/headers";
import backendApi from "@/lib/axios.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { contractId } = await req.json();
    // const userId = (await cookies()).get("userId");

    const res = await backendApi.post("/analysis", contractId, {
      headers: { "Content-Type": "application/json" },
    });
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
