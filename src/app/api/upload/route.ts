import { NextRequest, NextResponse } from "next/server";
import backendApi from "@/lib/axios.server";
import axios from "axios";

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
    return NextResponse.json(response.data._id, {
      status: response.status,
    });
  } catch (error) {
    console.log("error");

    if (axios.isAxiosError(error)) {
      console.error("Axios Error Message:", error.message);
      console.error("Axios Error Code:", error.code);
      console.error("Axios Error Config:", error.config);
      if (error.response) {
        console.error("Axios Error Response Status:", error.response.status);
        console.error("Axios Error Response Data:", error.response.data);
        console.error("Axios Error Response Headers:", error.response.headers);
        return NextResponse.json(
          { message: error.response.data },
          { status: error.response.status }
        );
      } else if (error.request) {
        console.error("Axios Error Request:", error.request);
      } else {
        console.error("Axios General Error:", error.message);
      }
    } else {
      console.error("Non-Axios Error:", error);
    }

    console.error("❌ 업로드 실패", error);
    return NextResponse.json({ message: "업로드 실패" }, { status: 500 });
  }
};
