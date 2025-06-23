"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import StatusIcon from "@/components/icons/Status";
import StyledInput from "@/components/StyledInput";
import { useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import { requestEmailVerification, requestRegister } from "@/lib/register";

function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    if (sessionStorage.getItem("start") !== "true") {
      router.replace("start");
    }
  }, [router]);
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [emailConfirm, setEmailConfirm] = useState<string[]>(["", ""]);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [userName, setUserName] = useState("");
  const [terms, setTerms] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);

  const handleRequest = async () => {
    try {
      document.getElementsByTagName("input")[1].focus();
      const result = await requestEmailVerification(email);
      setEmailConfirm([email, result.verifyCode]);
    } catch (err) {
      console.error(err);
      document.getElementsByTagName("input")[0].focus();
    }
  };

  const emailPattern = /\w+@\w+\.+\w+/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,14}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email !== emailConfirm[0]) {
      alert("인증 받은 이메일이 아닙니다.");
    } else if (verification !== emailConfirm[1]) {
      alert("인증 코드가 일치하지 않습니다.");
    } else if (!passwordPattern.test(password)) {
      alert(
        "비밀번호는 영어 대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상, 14자 이하로 설정해주셔야 합니다."
      );
    } else if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    } else {
      try {
        const result = await requestRegister({
          email,
          password,
          name: userName,
        });

        alert(result.message || "회원가입 성공!");
        router.replace("/login");
      } catch (err) {
        // console.error(err);
        alert((err as Error).message || "회원가입 실패! 다시 시도해주세요.");
      }
    }
    return;
  };

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center">
        <StatusIcon className="mt-[1.4rem]" />
      </div>
      <BackHeader to="login">회원가입</BackHeader>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-[5rem] mx-8 h-auto"
      >
        <div className="mt-12 flex flex-col gap-8">
          <div className="flex gap-4">
            <StyledInput
              autoFocus={true}
              type="email"
              width="25rem"
              fontSize={1.6}
              placeholder="이메일 입력"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <SubmitButton
              type="button"
              width={8}
              height={3}
              fontSize={1.2}
              fontWeight={600}
              disabled={email.length === 0 || !emailPattern.test(email)}
              onClick={handleRequest}
            >
              인증하기
            </SubmitButton>
          </div>
          <StyledInput
            type="text"
            width="34rem"
            fontSize={1.6}
            placeholder="인증 코드 입력"
            onChange={(e) => setVerification(e.target.value)}
            value={verification}
          />
          <StyledInput
            className={`flex flex-col justify-start${
              password.length === 0 || passwordPattern.test(password)
                ? ""
                : " border -m-px border-[#ff0000]"
            }`}
            type="password"
            width="34rem"
            fontSize={1.6}
            placeholder="대소문자, 숫자, 특수문자 포함 8-14글자 입력"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <StyledInput
            className={`flex flex-col justify-start${
              passwordConfirm.length === 0 ||
              (passwordPattern.test(passwordConfirm) &&
                password === passwordConfirm)
                ? ""
                : " border -m-px border-[#ff0000]"
            }`}
            type="password"
            width="34rem"
            fontSize={1.6}
            placeholder="비밀번호 확인"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
          />
          <StyledInput
            type="text"
            width="34rem"
            fontSize={1.6}
            placeholder="이름 입력"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
        </div>
        <div className="bg-mainL mt-16 p-12 w-[36rem] justify-center rounded-[50px] flex flex-col gap-4">
          <div className="flex mb-4 gap-4 items-center">
            <input
              type="checkbox"
              id="terms-total"
              className="w-6 h-6"
              checked={terms.filter((v) => v).length === 3}
              onChange={(e) =>
                setTerms([e.target.checked, e.target.checked, e.target.checked])
              }
            />
            <label htmlFor="terms-total" className="text-[1.8rem] font-bold">
              약관 전체 동의
            </label>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-4 items-center">
              <input
                type="checkbox"
                id="terms-0"
                className="w-6 h-6"
                checked={!!terms[0]}
                onChange={(e) =>
                  setTerms([e.currentTarget.checked, terms[1], terms[2]])
                }
              />
              <label htmlFor="terms-0" className="text-[1.6rem]">
                이용 약관 동의&nbsp;
              </label>
              <span className="text-main text-[1.2rem]">본문 보기</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="checkbox"
              name=""
              id="terms-1"
              className="w-6 h-6"
              checked={!!terms[1]}
              onChange={(e) => setTerms([terms[0], e.target.checked, terms[2]])}
            />
            <label htmlFor="terms-1" className="text-[1.6rem]">
              개인정보 수집 및 이용 동의&nbsp;
            </label>
            <span className="text-main text-[1.2rem]">본문 보기</span>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="checkbox"
              name=""
              id="terms-2"
              className="w-6 h-6"
              checked={!!terms[2]}
              onChange={(e) => setTerms([terms[0], terms[1], e.target.checked])}
            />
            <label htmlFor="terms-2" className="text-[1.6rem]">
              마케팅 정보 수신 동의 (선택)&nbsp;
            </label>
            <span className="text-main text-[1.2rem]">본문 보기</span>
          </div>
        </div>
        <div className="w-[30rem] flex flex-1 items-end mt-28 mb-8">
          <SubmitButton
            disabled={
              verification.length === 0 ||
              password.length === 0 ||
              password !== passwordConfirm ||
              userName.length === 0 ||
              !terms[0] ||
              !terms[1]
            }
          >
            가입하기
          </SubmitButton>
        </div>
      </form>
    </>
  );
}

export default RegisterPage;
