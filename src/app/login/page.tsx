// page.tsx
"use client";

import { useRouter } from "next/navigation";
import KakaoIcon from "@/components/icons/sns/Kakao";
import StyledInput from "@/components/StyledInput";
import { useEffect, useState } from "react";
import GoogleIcon from "@/components/icons/sns/Google";
import NaverIcon from "@/components/icons/sns/Naver";
import AppleIcon from "@/components/icons/sns/Apple";
import SubmitButton from "@/components/SubmitButton";
import axios from "axios";
import { useAuthStore } from "@/store/useStore";
import Image from "next/image";

function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (sessionStorage.getItem("start") !== "true") {
      router.replace("start");
    }
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const rememberEmail = localStorage.getItem("remember");
    const auto = localStorage.getItem("autoLogin");
    if (rememberEmail) setEmail(rememberEmail);
    if (auto) setEmail(auto);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", { email, password });
      console.log("[LOGIN SUCCESS RESPONSE]", res);
      if (res.data.success) {
        const { userName, notification, contractArray, recentChat } = res.data;
        useAuthStore.setState({
          userName,
          notification,
          contractArray,
          recentChat,
        });
        router.push("/");
      } else {
        alert(res.data.message || "로그인 실패 (응답: success: false)");
        console.log(res.data.success);
        console.log(res.data);
      }
    } catch (error) {
      console.error("[LOGIN ERROR]", error);

      // ✅ Axios error라면 response에 서버 메시지 있음
      if (axios.isAxiosError(error) && error.response) {
        console.log("[AXIOS ERROR RESPONSE]", error.response);
        alert(error.response.data?.message || "로그인 실패 (서버 응답 있음)");
      } else {
        // 네트워크 등 기타
        alert("로그인 요청 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <main className="flex flex-col items-center mt-[3rem] gap-12 mx-10 h-auto">
        <div className="mt-20 w-full gap-4 flex flex-col justify-center items-center">
          <Image
            width={9999}
            height={9999}
            src="/logo.svg"
            alt="logo"
            className="h-16"
          />
          <span className="h-20 font-semibold text-[4rem] tracking-[-0.04em] bg-gradient-to-r from-[#6000FF] to-[#E100FF] bg-clip-text text-transparent">
            Super LawVA
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-12 w-full flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4 text-[1.8rem]">
            <span className="font-medium">이메일 주소</span>
            <StyledInput
              type="email"
              placeholder="super@lvw.com"
              pattern="\w+@\w+\.\w+"
              title="올바른 이메일 형식(예: example@domain.com)을 입력하세요."
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4 text-[1.8rem]">
            <span className="font-medium">비밀번호</span>
            <StyledInput
              type="password"
              placeholder="대소문자, 숫자, 특수문자 포함하여 8글자 이상"
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$"
              // title="비밀번호는 8자 이상이며, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다."
              // required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-10">
            <div className="flex gap-4">
              <input type="checkbox" className="w-6 h-6" />
              <label htmlFor="" className="text-[1.2rem]">
                아이디 저장
              </label>
            </div>
            {/* checkbox 커스텀 코드 */}
            {/* <div className="grid items-center justify-center">
              <input
                type="checkbox"
                className="peer col-start-1 row-start-1 w-8 h-8 appearance-none rounded border-2 border-gray-300 checked:border-main checked:bg-main dark:border-gray-600 dark:checked:border-main forced-colors:appearance-auto"
              />
              <svg
                viewBox="0 0 14 14"
                fill="none"
                className="invisible col-start-1 row-start-1 stroke-black peer-checked:visible dark:text-violet-300 forced-colors:hidden pointer-events-none"
              >
                <path
                  d="M3 8L6 11L11 3.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#ffffff"
                ></path>
              </svg>
            </div> */}

            <div className="flex gap-4">
              <input type="checkbox" className="w-6 h-6" />
              <label htmlFor="" className="text-[1.2rem]">
                자동 로그인
              </label>
            </div>
          </div>
          <SubmitButton
            disabled={
              !/\w+@\w+\.+\w+/.test(email)
              //  ||
              // !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(
              //   password
              // )
            }
            className="mt-8 flex justify-center items-center"
          >
            로그인
          </SubmitButton>
          <div className="flex justify-center gap-4 text-l font-medium">
            <span>아이디 찾기</span>|<span>비밀번호 찾기</span>|
            <button type="button" onClick={() => router.push("register")}>
              회원가입
            </button>
          </div>
        </form>
        <div className="w-full flex flex-col justify-center items-center gap-8">
          <div className="mt-16 w-full flex justify-between items-center gap-4 text-xl">
            {/* <hr className="flex-1 border-[#797979]" />
            <span className="flex-1 text-center">SNS 계정으로 로그인</span>
            <hr className="flex-1 border-[#797979]" /> */}
            <hr className="w-full border-[#797979]" />
            <span className="min-w-44 text-center">SNS 계정으로 로그인</span>
            <hr className="w-full border-[#797979]" />
          </div>
          <div className="flex flex-row gap-12">
            <KakaoIcon />
            <GoogleIcon />
            <NaverIcon />
            <AppleIcon />
          </div>
        </div>
      </main>
    </>
  );
}

export default LoginPage;
