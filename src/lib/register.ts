// lib/api/register.ts
import axios from "axios";

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export async function requestEmailVerification(email: string) {
  // const response = await axios.post("/api/register/email", { email });
  const response = await axios.post("/api/register/emailVerify", { email });
  return response.data;
}

export const requestRegister = async (payload: RegisterPayload) => {
  const response = await axios.post("/api/register", payload);
  return response.data; // 성공 시 결과 (예: { message: "회원가입 성공!" })
};
