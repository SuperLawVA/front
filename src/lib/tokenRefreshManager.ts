import axios from "axios";

// 토큰 갱신을 주기적으로 실행하는 setInterval ID를 저장할 변수
let refreshInterval: ReturnType<typeof setInterval> | null = null;
// 유저의 마지막 활동 시각을 밀리초 단위로 저장 (초기값은 현재 시각)
let lastActivity = Date.now();
// 토큰 자동 갱신 시도 간격을 5분(밀리초 단위)로 설정
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5분

// 유저가 활동(마우스 이동, 키보드 입력 등)을 할 때 호출되어
// 마지막 활동 시각을 현재 시각으로 갱신하는 함수
function updateActivity() {
  lastActivity = Date.now();
}

// 주기적으로 실행되어 유저의 '비활성 시간(idle time)'을 계산하고,
// 일정 시간 이내라면 서버에 토큰 갱신 요청을 보내는 함수
function startAutoRefresh() {
  if (refreshInterval) return; // 이미 실행 중이면 중복 실행 방지

  // 5분마다 실행하는 타이머 설정
  refreshInterval = setInterval(async () => {
    const idleTime = Date.now() - lastActivity; // 마지막 활동 이후 경과 시간 계산
    if (idleTime < REFRESH_INTERVAL) {
      // 유저가 최근 5분 이내에 활동했으면 토큰 갱신 시도
      try {
        // Next.js API 라우트에 POST 요청, 쿠키 포함하여 토큰 갱신 (axios 사용)
        await axios.post("/api/refresh", null, {
          withCredentials: true, // 쿠키 포함
        });
        console.log("[AutoRefresh] Token refreshed.");
      } catch {
        // 갱신 실패 시 (예: Refresh Token 만료) 로그아웃 처리
        console.warn("[AutoRefresh] Refresh failed. Logging out.");
        window.location.href = "/login"; // 로그인 페이지로 이동
      }
    } else {
      // 유저가 5분 이상 비활성 상태면 갱신을 건너뜀 (비활성 시간 로그)
      console.log("[AutoRefresh] User idle, skipping refresh.");
    }
  }, REFRESH_INTERVAL);
}

// 외부에서 호출할 초기화 함수:
// 유저 활동 이벤트 리스너 등록 + 자동 갱신 주기 시작
export function initTokenAutoRefresh() {
  window.addEventListener("mousemove", updateActivity); // 마우스 이동
  window.addEventListener("keydown", updateActivity); // 키보드 입력
  window.addEventListener("scroll", updateActivity); // 스크롤
  startAutoRefresh(); // 자동 갱신 타이머 시작
}
