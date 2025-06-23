// lib/axios.ts
import axios, { InternalAxiosRequestConfig } from "axios";
import { logEvent } from "./logger";
import { getDeviceType } from "./useUserActionLogger";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// 요청 인터셉터: 요청 시작 시간 기록
api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig & { metadata?: { startTime: number } }
  ) => {
    config.metadata = { startTime: Date.now() };
    return config;
  }
);

// 공통 변수 (쿠키는 서버에서만)
const userId = "none";
// try {
//   const cookieStore = await cookies();
//   userId = String(cookieStore.get("userId")?.value ?? "none");
// } catch {
//   // 서버 실행 안되는 경우 무시
// }

// client 전용
const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
const deviceType = getDeviceType();
const width = typeof window !== "undefined" ? window.innerWidth : 0;
const height = typeof window !== "undefined" ? window.innerHeight : 0;

// 응답 인터셉터
api.interceptors.response.use(
  async (response) => {
    const endTime = Date.now();
    const metadata = (
      response.config as InternalAxiosRequestConfig & {
        metadata?: { startTime: number };
      }
    ).metadata;
    const duration = metadata ? endTime - metadata.startTime : 0;

    // 📌 page 정보는 호출 시 전달하도록 변경!
    await logEvent({
      userId,
      userAgent,
      deviceType,
      width,
      height,
      page: response.config.headers?.["x-page"] || "unknown",
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
    const config = error.config as InternalAxiosRequestConfig & {
      metadata?: { startTime: number };
      _retry?: boolean;
    };

    const endTime = Date.now();
    const duration = config.metadata ? endTime - config.metadata.startTime : 0;

    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      await axios.post("/api/refresh", {}, { withCredentials: true });
      return api(config);
    }

    await logEvent({
      userId,
      userAgent,
      deviceType,
      width,
      height,
      page: config.headers?.["x-page"] || "unknown",
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
