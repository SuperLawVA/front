// page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import BackHeader from "@/components/BackHeader";
import StyledInput from "@/components/StyledInput";
import SubmitButton from "@/components/SubmitButton";


function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function LoginPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"id" | "password">("id");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showIdResult, setShowIdResult] = useState(false);

  // 테스트용 인증코드 (실제 서비스는 백엔드 연동 필요)
  const [realCode, setRealCode] = useState("654321");

  // 이메일 인증코드 전송
  const handleSend = () => {
    setSent(true);
    setRealCode("654321");
    setVerified(false);
    setCode("");
    alert("인증코드: 654321 (테스트)");
  };

  // 인증번호 확인
  const handleVerify = () => {
    if (code === realCode) {
      setVerified(true);
      alert("이메일 인증 성공!");
    } else {
      setVerified(false);
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  // 임시 mock 결과 (실제라면 인증/조회 후 받아오는 정보)
  const userId = "abcdefg123@naver.com";
  const joinedAt = "2018. 01. 24";


  return (
    <>
    <div className="h-20 w-full flex flex-col justify-center items-center" />
    <BackHeader>아이디 / 비밀번호 찾기</BackHeader>

    <div className="flex h-12 mt-20 mb-8">
        <button
          className={`flex-1 text-center !text-[1.5rem] !font-bold pb-2
            ${tab === "id" ? "text-[#6000ff]" : "text-[#bababa]"}`}
          onClick={() => setTab("id")}
        >
          아이디 찾기
          <div
            className={`h-[4px] mt-2 transition-all duration-200
              ${tab === "id" ? "bg-[#6000ff]" : "bg-transparent"}`}
          />
        </button>
        <button
          className={`flex-1 text-center !text-[1.5rem] !font-bold pb-2
            ${tab === "password" ? "text-[#6000ff]" : "text-[#bababa]"}`}
          onClick={() => setTab("password")}
        >
          비밀번호 찾기
          <div
            className={`h-[4px] mt-2 transition-all duration-200
              ${tab === "password" ? "bg-[#6000ff]" : "bg-transparent"}`}
          />
        </button>
      </div>

      {/* ============= 아이디 찾기: 결과화면 ============= */}
      {tab === "id" && (
        showIdResult ? (
          <div className="w-full flex flex-col items-center mt-20">
            <div className="text-center text-[1.09rem] text-[#888] mb-8 mt-8">
              이메일 정보와 일치하는 아이디입니다.
            </div>
            <div className="w-full bg-white rounded-[12px] border border-[#e5e5e5] p-8 mb-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[1.1rem] font-semibold">아이디 :</span>
                {/* 네이버 아이콘 등은 img로 교체 가능 */}
                <span className="font-[600] text-[1.13rem]">{userId}</span>
              </div>
              <div className="text-[1rem] mt-3">
                가입일 : <span className="font-semibold">{joinedAt}</span>
              </div>
            </div>
            <div className="flex w-full max-w-md gap-3 justify-center">
              <SubmitButton
                width={12}
                height={4}
                fontSize={1.3}
                className="border-2 border-[#6000ff] text-[#6000ff] bg-white"
                onClick={() => router.replace("/login")}
              >
                확인
              </SubmitButton>
              <SubmitButton
                width={18}
                height={4}
                fontSize={1.3}
                className="bg-[#eee] text-[#aaa]"
                disabled
              >
                비밀번호 재설정
              </SubmitButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 items-center w-full px-4 mt-30">
            {/* 이메일 입력 + 인증번호 전송 */}
            <div className="flex w-full max-w-md items-center gap-2 ml-15">
              <StyledInput
                autoFocus={true}
                type="email"
                width="25rem"
                fontSize={1.4}
                placeholder="이메일 입력"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <SubmitButton
                onClick={handleSend}
                type="button"
                width={8}
                height={3}
                fontSize={1.2}
                fontWeight={600}
                disabled={!isValidEmail(email) || (sent && !verified)}
              >
                인증번호 전송
              </SubmitButton>
            </div>
            {/* 인증코드 입력 + 확인 버튼 */}
            <div className="flex w-full max-w-md items-center gap-2 ml-15 mt-5">
              <StyledInput
                type="tel"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="인증코드 입력"
                width="25rem"
                fontSize={1.4}
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                disabled={!sent || verified}
              />
              <SubmitButton
                onClick={handleVerify}
                type="button"
                width={8}
                height={3}
                fontSize={1.2}
                fontWeight={600}
                disabled={!sent || !code || verified}
              >
                확인
              </SubmitButton>
            </div>
            {/* 인증 완료 안내 */}
            {verified && (
              <div className="text-green-600 font-semibold mt-2 text-[0.98rem]">
                인증 완료!
              </div>
            )}
            {/* 아이디 찾기 버튼 */}
            <SubmitButton
              type="button"
              width={30}
              height={5}
              fontSize={2}
              disabled={!verified}
              className="mt-10"
              onClick={() => setShowIdResult(true)}
            >
              아이디 찾기
            </SubmitButton>
          </div>
        )
      )}


      {tab === "password" && (
        <div className="flex flex-col gap-5 items-center w-full px-4">
          {/* 아이디 입력 */}
          <input
            type="text"
            placeholder="아이디 입력"
            className="w-full max-w-md px-4 py-3 border rounded-full text-[1.05rem] bg-[#fafafa] focus:outline-none"
          />
          {/* 비밀번호 찾기 버튼 */}
          <button
            className="mt-4 w-full max-w-md bg-[#6000ff] text-white text-[1.12rem] font-bold py-4 rounded-full shadow transition active:scale-95"
          >
            비밀번호 찾기
          </button>
        </div>
      )}
    </>
  );
}
export default LoginPage;
