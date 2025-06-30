// lib/axios.client.ts
import axios from "axios";

// 1) 클라이언트용 axios (BFF와 통신용)
const clientApi = axios.create({
  baseURL: "http://localhost:3000/api", // BFF 서버 경로 (프론트에서 BFF로 요청)
  // baseURL: "/api", // BFF 서버 경로 (프론트에서 BFF로 요청)
  withCredentials: true, // 쿠키 포함
});

export default clientApi;
