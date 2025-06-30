// lib/axios.server.ts
import axios from "axios";
import { cookies } from "next/headers";

// 1) BFF 서버에서 실제 백엔드 API 호출용 axios
const backendApi = axios.create({
  baseURL: process.env.BACKEND_URL, // 실제 백엔드 API 주소
  withCredentials: true, // 필요하면 쿠키 포함 여부 설정
});

// 요청 인터셉터: Authorization 헤더에 JWT 토큰 추가
backendApi.interceptors.request.use(
  async (config) => {
    // 서버에서 쿠키 값 가져오기 (await 사용)
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value; // 쿠키에서 'jwt' 값 가져오기

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default backendApi;
