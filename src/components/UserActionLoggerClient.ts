"use client"; // 클라이언트 전용

// import { initTokenAutoRefresh } from "@/lib/tokenRefreshManager";
import { useUserActionLogger } from "@/lib/useUserActionLogger";

export function UserActionLoggerClient() {
  useUserActionLogger();
  // initTokenAutoRefresh();
  // useUserActionLogger({ userId });
  return null; // 화면에 렌더링 X
}
