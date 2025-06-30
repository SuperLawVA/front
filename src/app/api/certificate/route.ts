// app/api/certificate/route.ts
import backendApi from "@/lib/axios.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { certificateId } = await req.json();
    console.log(certificateId);
    const response = await backendApi.post("/certificate", { certificateId });
    console.log("res");
    console.log(response);
    console.log("res.data");
    console.log(response.data);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
