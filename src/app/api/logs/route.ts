// app/api/logs/route.ts
import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

// JSON 파일 저장 위치 (프로젝트 루트/logs.json)
const LOG_FILE = path.join(process.cwd(), "logs.json");

export async function POST(request: Request) {
  try {
    const logEntry = await request.json();
    const userId = (await cookies()).get("userId");
    logEntry.userId = userId;
    console.log("[SERVER LOG]", logEntry);

    // 기존 로그 파일 읽기
    let logs: object[] = [];
    try {
      const data = await readFile(LOG_FILE, "utf-8");
      logs = JSON.parse(data);
    } catch (err) {
      // 파일이 없으면 새로 생성 예정
      console.log((err as Error).message || "logs.json 파일 없음, 새로 생성");
    }

    // 새 로그 추가
    logs.push(logEntry);

    // JSON 파일로 다시 저장
    await writeFile(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("로그 저장 실패:", error);
    return NextResponse.json(
      { status: "error", error: String(error) },
      { status: 500 }
    );
  }
}
