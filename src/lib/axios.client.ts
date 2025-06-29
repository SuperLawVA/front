// lib/axios.client.ts
import axios, { InternalAxiosRequestConfig } from "axios";

// 1) 클라이언트용 axios (BFF와 통신용)
const clientApi = axios.create({
  baseURL: "http://localhost:3000/api", // BFF 서버 경로 (프론트에서 BFF로 요청)
  withCredentials: true, // 쿠키 포함
});

// // 요청 인터셉터: 요청 시작 시간 기록
// clientApi.interceptors.request.use(
//   (
//     config: InternalAxiosRequestConfig & { metadata?: { startTime: number } }
//   ) => {
//     config.metadata = { startTime: Date.now() };
//     return config;
//   }
// );

// // 응답 인터셉터: API 응답 시간 기록 및 로그
// clientApi.interceptors.response.use(
//   async (response) => {
//     // favicon.ico 요청은 무시
//     if (response.config.url?.includes("favicon.ico")) {
//       return response;
//     }

//     const endTime = Date.now();
//     const metadata = (
//       response.config as InternalAxiosRequestConfig & {
//         metadata?: { startTime: number };
//       }
//     ).metadata;
//     const duration = metadata?.startTime ? endTime - metadata.startTime : 0;

//     const userAgent =
//       typeof navigator !== "undefined" ? navigator.userAgent : "";
//     const deviceType =
//       typeof window !== "undefined" ? getDeviceType() : "server";
//     const width = typeof window !== "undefined" ? window.innerWidth : 0;
//     const height = typeof window !== "undefined" ? window.innerHeight : 0;

//     // await logEvent({
//     //   userId: "none", // 서버에서 쿠키로 userId를 관리하는 방식 필요
//     //   userAgent,
//     //   deviceType,
//     //   width,
//     //   height,
//     //   page: response.config.headers?.["x-page"] || "unknown",
//     //   type: "api_response",
//     //   data: {
//     //     method: response.config.method,
//     //     url: response.config.url,
//     //     status: response.status,
//     //     duration,
//     //     success: true,
//     //   },
//     //   timestamp: new Date().toISOString(),
//     // });

//     return response;
//   },
//   async (error) => {
//     const config = (error.config ?? {}) as InternalAxiosRequestConfig & {
//       metadata?: { startTime: number };
//       _retry?: boolean;
//     };

//     // favicon.ico 요청은 무시
//     if (config.url?.includes("favicon.ico")) {
//       return Promise.reject(error);
//     }

//     const endTime = Date.now();
//     const duration =
//       config.metadata?.startTime != null
//         ? endTime - config.metadata.startTime
//         : 0;

//     const userAgent =
//       typeof navigator !== "undefined" ? navigator.userAgent : "";
//     const deviceType =
//       typeof window !== "undefined" ? getDeviceType() : "server";
//     const width = typeof window !== "undefined" ? window.innerWidth : 0;
//     const height = typeof window !== "undefined" ? window.innerHeight : 0;

//     // await logEvent({
//     //   userId: "none",
//     //   userAgent,
//     //   deviceType,
//     //   width,
//     //   height,
//     //   page: config.headers?.["x-page"] || "unknown",
//     //   type: "api_response",
//     //   data: {
//     //     method: config?.method,
//     //     url: config?.url,
//     //     status: error.response?.status,
//     //     duration,
//     //     success: false,
//     //     message: error.message,
//     //   },
//     //   timestamp: new Date().toISOString(),
//     // });

//     if (error.response?.status === 401 && !config._retry) {
//       config._retry = true;
//       await axios.post("/api/refresh", {}, { withCredentials: true });
//       return clientApi(config);
//     }

//     return Promise.reject(error);
//   }
// );

export default clientApi;
