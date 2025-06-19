// lib/axios.ts
import axios from "axios";
import { logEvent } from "./logger";
import { getDeviceType } from "./useUserActionLogger";
import { usePathname } from "next/navigation";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 쿠키 자동 포함 (JWT가 쿠키에 저장됐을 때 필요)
});

// 요청 인터셉터: 요청 시작 시간 기록
api.interceptors.request.use((config) => {
  (config as any).metadata = { startTime: new Date().getTime() };
  return config;
});

// 응답 인터셉터
const userId = sessionStorage.getItem("userId") || "none";
const userAgent = navigator.userAgent;
const deviceType = getDeviceType();
const width = window.innerWidth;
const height = window.innerHeight;
const page = usePathname();

api.interceptors.response.use(
  async (response) => {
    // 응답 성공 시 응답시간 측정
    const endTime = new Date().getTime();
    const metadata = (response.config as any).metadata;
    const duration = endTime - metadata.startTime;

    // 로그 전송 (성공)
    await logEvent({
      userId,
      userAgent,
      deviceType,
      width,
      height,
      page,
      type: "api_response",
      data: {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
        duration,
        success: true,
      },
      timestamp: new Date().toISOString(),
    });

    return response;
  },
  async (error) => {
    const config = error.config;

    // 실패 응답 응답시간 측정
    const metadata = (config as any)?.metadata;
    const endTime = new Date().getTime();
    const duration = metadata ? endTime - metadata.startTime : null;

    // 401 Unauthorized 에러 & 재시도 안한 경우
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        // 리프레시 토큰으로 새 토큰 발급 요청
        await axios.post("/api/refresh", {}, { withCredentials: true });
        // 성공 시 원래 요청 재시도
        return api(config);
      } catch (refreshError) {
        // 리프레시 실패 시 로그인 페이지 이동
        window.location.href = "/login";
      }
    }

    // 로그 전송 (실패)
    await logEvent({
      userId,
      userAgent,
      deviceType,
      width,
      height,
      page,
      type: "api_response",
      data: {
        method: config?.method,
        url: config?.url,
        status: error.response?.status,
        duration,
        success: false,
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });

    return Promise.reject(error);
  }
);

export default api;
