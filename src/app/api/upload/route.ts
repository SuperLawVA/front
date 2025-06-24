import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  console.log(
    "받은 파일 목록:",
    files.map((f) => ({
      name: f.name,
      size: f.size,
    }))
  );

  return NextResponse.json({
    message: "파일 업로드 성공",
    files: files.map((f) => ({
      name: f.name,
      size: f.size,
    })),
  });
}
