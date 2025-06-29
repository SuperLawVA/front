import fs from "fs";
import path from "path";
import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";
import backendApi from "@/lib/axios.server";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { message: "파일이 없습니다." },
        { status: 400 }
      );
    }
    const response = await backendApi.post("/upload", formData);

    console.log("✅ OCR 응답:", response);
    console.log(response.data);
    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err) {
    console.error("❌ 업로드 실패", err);
    return NextResponse.json({ message: "업로드 실패" }, { status: 500 });
  }
};
