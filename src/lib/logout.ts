import axios from "axios";
import useAuthStore from "@/store/useAuthStore";

export async function logout() {
  // 1️⃣ 서버에 쿠키 제거 요청
  await axios.post("/api/logout");

  // 2️⃣ sessionStorage 초기화
  sessionStorage.removeItem("message");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("notification");
  sessionStorage.removeItem("contract");
  sessionStorage.removeItem("recentChat");
  sessionStorage.setItem("start", "true");

  // 3️⃣ zustand 초기화
  const authStore = useAuthStore.getState();
  authStore.setMessage("");
  authStore.setUserName("");
  authStore.setNotification([]);
  authStore.setContract(null);
  authStore.setRecentChat(null);
}
