// appapi/upload/route.ts
// import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const fileNames = formData.getAll("fileNames") as string[];

    if (files.length === 0) {
      return NextResponse.json(
        { message: "파일이 없습니다." },
        { status: 400 }
      );
    }

    // ✅ 예: 파일과 이름 쌍 확인

    const backendFormData = new FormData();

    for (let i = 0; i < files.length; i++) {
      backendFormData.append("files", files[i]);
      backendFormData.append("fileNames", fileNames[i]);
    }
    return NextResponse.json({ message: "업로드 성공" }, { status: 200 });

    // const backendRes = await axios.post(
    //   "https://your-backend/api/upload",
    //   backendFormData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );

    // return NextResponse.json(backendRes.data, { status: backendRes.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "업로드 실패" }, { status: 500 });
  }
};
