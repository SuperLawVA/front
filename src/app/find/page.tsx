"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import StyledInput from "@/components/StyledInput";
import SubmitButton from "@/components/SubmitButton";
import Image from "next/image";

function LoginPage() {
  const router = useRouter();

  // 단계: 1 = 이메일, 2 = 인증코드, 3 = 비밀번호
  const [step, setStep] = useState(1);

  // 이메일 인증 관련
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [realCode, setRealCode] = useState("654321"); // 테스트용
  const [sent, setSent] = useState(false);
  console.log(sent);

  // 비밀번호 관련
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [pwChanged, setPwChanged] = useState(false);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPassword(pw: string) {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/~`]).{8,14}$/.test(
      pw
    );
  }

  // 단계별 동작
  const handleNext = () => {
    if (step === 1) {
      // 이메일 입력 → 인증코드 단계로
      setSent(true);
      setRealCode("654321");
      setCode("");
      alert("인증코드: 654321 (테스트)");
      setStep(2);
    } else if (step === 2) {
      // 인증코드 확인
      if (code === realCode) {
        alert("이메일 인증 성공!");
        setStep(3);
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    } else if (step === 3) {
      // 비밀번호 변경 완료
      setPwChanged(true);
      alert("비밀번호가 성공적으로 재설정되었습니다!");
      router.push("/login");
    }
  };

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <BackHeader onClick={() => router.back()} />

      <div className="flex flex-col gap-5 w-full mt-[5rem]">
        <div className="flex flex-col items-start ml-[4rem]">
          <div className="text-[2rem] font-semibold">
            <span className="text-[#6000ff] text-[2.3rem]">비밀번호</span>를
            잊으셨나요?
          </div>
          <span className="mt-3 text-[1.2rem]">
            비밀번호 재설정을 위해 가입한 이메일 주소를 입력해주세요.
          </span>
        </div>

        {/* 1. 이메일 입력 */}
        <>
          <div className="flex w-full items-center justify-center gap-4 relative mt-[5rem]">
            <StyledInput
              autoFocus
              type="email"
              width="30rem"
              fontSize={1.4}
              placeholder="이메일 입력"
              value={email}
              disabled={step > 1}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {step === 1 && (
            <SubmitButton
              type="button"
              width={30}
              height={5}
              fontSize={1.3}
              className="fixed bottom-30 ml-18"
              disabled={!isValidEmail(email)}
              onClick={handleNext}
            >
              다음
            </SubmitButton>
          )}
        </>

        {/* 2. 인증번호 입력 */}
        {step >= 2 && (
          <>
            <div className="flex w-full max-w-md items-center justify-center gap-4 relative mt-8">
              <StyledInput
                autoFocus
                type="tel"
                width="30rem"
                fontSize={1.4}
                placeholder="인증코드 입력"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                inputMode="numeric"
              />
            </div>
            {step === 2 && (
              <SubmitButton
                type="button"
                width={30}
                height={5}
                fontSize={1.3}
                className="fixed bottom-30 ml-18"
                disabled={!code}
                onClick={handleNext}
              >
                다음
              </SubmitButton>
            )}
          </>
        )}

        {/* 3. 비밀번호/확인 입력 */}
        {step >= 3 && (
          <>
            <div className="relative flex w-full max-w-md items-center justify-center mt-8">
              <StyledInput
                autoFocus
                type={showPassword ? "text" : "password"}
                width="30rem"
                fontSize={1.4}
                placeholder="새 비밀번호 (8~14자, 영문/숫자/특수문자)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-21 top-1/2 -translate-y-1/2 z-10"
                tabIndex={-1}
              >
                {showPassword ? (
                  <Image
                    src="/eye.svg"
                    alt="show password"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src="/close-eye.svg"
                    alt="hide password"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
            <div className="relative flex w-full max-w-md items-center justify-center mt-[2rem]">
              <StyledInput
                type={showPasswordConfirm ? "text" : "password"}
                width="30rem"
                fontSize={1.4}
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((v) => !v)}
                className="absolute right-21 top-1/2 -translate-y-1/2 z-10"
                tabIndex={-1}
              >
                {showPasswordConfirm ? (
                  <Image
                    src="/eye.svg"
                    alt="show password"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image
                    src="/close-eye.svg"
                    alt="hide password"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>
            {/* 안내문구 */}
            {password && passwordCheck && (
              <div
                className={`text-[0.97rem] font-medium mt-2 text-center
                ${
                  password === passwordCheck ? "text-green-600" : "text-red-500"
                }`}
              >
                {password === passwordCheck
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </div>
            )}
            {password && !isValidPassword(password) && (
              <div className="text-red-500 text-[0.93rem] mt-2 text-center">
                비밀번호는 8~14자, 영문/숫자/특수문자를 모두 포함해야 합니다.
              </div>
            )}
            <SubmitButton
              type="button"
              width={30}
              height={5}
              fontSize={1.3}
              className="fixed bottom-30 ml-18"
              disabled={
                !password ||
                !passwordCheck ||
                password !== passwordCheck ||
                !isValidPassword(password)
              }
              onClick={handleNext}
            >
              완료
            </SubmitButton>
          </>
        )}
        {/* 완료 메시지 */}
        {pwChanged && (
          <div className="text-green-600 font-semibold mt-6 text-[1.08rem]">
            비밀번호가 성공적으로 변경되었습니다!
          </div>
        )}
      </div>
    </>
  );
}
export default LoginPage;
