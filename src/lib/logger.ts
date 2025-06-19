// lib/logger.ts

import axios from "axios";

export interface LogEntry {
  userId: string;
  userAgent: string;
  deviceType: "pc" | "mobile" | "tablet";
  width: number;
  height: number;
  page: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
}

// ---- [NEW] BATCH ---- //
let logQueue: LogEntry[] = [];
let flushTimer: NodeJS.Timeout | null = null;

const BATCH_SIZE = 10;
const BATCH_INTERVAL = 2000; // ms

// 로그를 서버로 전송하는 함수 (axios 사용)
async function flushLogs() {
  if (logQueue.length === 0) return;

  const logsToSend = [...logQueue];
  logQueue = [];

  try {
    await axios.post("/api/logs", logsToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error("Failed to send batch logs", e);
    // 필요하다면 실패 시 재시도 로직 추가
  }
}

function startFlushTimer() {
  if (flushTimer) return;
  flushTimer = setInterval(() => {
    flushLogs();
  }, BATCH_INTERVAL);
}

// ---- [MAIN EXPORT] ---- //
export function logEvent(entry: LogEntry) {
  // console.log(`[UserLog][${entry.type}]`, entry);
  logQueue.push(entry);

  // 큐가 가득 차면 즉시 flush
  if (logQueue.length >= BATCH_SIZE) {
    flushLogs();
  }

  // flush 타이머 시작
  startFlushTimer();
}

// 👉 라우팅, beforeunload에서 사용
export { flushLogs };
