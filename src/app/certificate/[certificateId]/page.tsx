// app/main/certificate/result/page.tsx
"use client";

import ReactMarkdown from "react-markdown";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import BackHeader from "@/components/BackHeader";
import InfoIcon from "@/components/icons/Info";
import AnalysisIcon from "@/components/icons/Analysis";
// import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import Modal from "@/components/Modal";
import ScalesIcon from "@/components/icons/Scales";
import clientApi from "@/lib/axios.client";
// import DocumentIcon from "@/components/icons/Document";
import GreenLogoIcon from "@/components/icons/GreenLogo";
import StyledInput from "@/components/StyledInput";
import axios from "axios";

export interface Certificate {
  _id: string; // 고유 ID (문자열)
  userId: string; // 사용자 ID
  contractId: string; // 연관 계약 ID
  createdDate: string; // ISO 문자열
  title: string; // 제목

  receiver: {
    name: string;
    address: string;
    detailAddress: string;
  };

  sender: {
    name: string;
    address: string;
    detailAddress: string;
  };

  body: string; // 본문

  strategySummary: string; // 전략 요약
  followupStrategy: string; // 추후 전략

  legalBasis: {
    lawId: number;
    law: string;
    explanation: string;
  }[];

  caseBasis: {
    caseId: number;
    case: string;
    explanation: string;
  }[];
}

export default function CertificatePage(props: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = use(props.params);
  const [openOriginal, setOpenOriginal] = useState(false);
  const [certificate, setCertificate] = useState<Certificate>();
  const [openSend, setOpenSend] = useState(false);
  const [sendStep, setSendStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const router = useRouter();

  const getCertificate = async () => {
    try {
      const response = await clientApi.post("/certificate", {
        certificateId,
      });
      setCertificate(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error");
        console.log(error);

        if (error.status === 404 || error.status === 401) {
          alert(error.status + " 잘못된 접근입니다!");
          return;
        }
        alert("500 알 수 없는 오류 발생");
        router.replace("/");
      }
    }
  };

  const [loading, setLoading] = useState(false);
  console.log(loading);

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await clientApi.post("/certificate/sendMail", {
        certificate,
        receiverEmail: email,
      });
      await response.data;
      if (response.data.status == "ok") {
        setSendStep(2);
      } else {
        throw Error;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error");
        console.log(error);

        // if (error.status === 404 || error.status === 401) {
        //   alert(error.status + " 잘못된 접근입니다!");
        //   return;
        // }
        alert("500 알 수 없는 오류 발생");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCertificate();
  }, []);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleRef = useRef(null);
  const startY = useRef(0);
  const [dragY, setDragY] = useState(0);

  function onDragStart(e: React.TouchEvent | React.MouseEvent) {
    startY.current = (e as unknown as TouchEvent).touches
      ? (e as unknown as TouchEvent).touches[0].clientY
      : (e as unknown as MouseEvent).clientY;
    setDragY(0);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
  }

  function onDragMove(e: TouchEvent | MouseEvent) {
    const currentY = (e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientY
      : (e as MouseEvent).clientY;
    setDragY(currentY - startY.current);
  }

  function onDragEnd() {
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
    if (dragY > 80) setOpenSend(false);
    setDragY(0);
  }

  return (
    <>
      {/* ── 헤더 ── */}
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <BackHeader to="/">내용증명서 생성</BackHeader>

      {/* ── 본문 ── */}
      {certificate && (
        <main className="flex-1 flex flex-col items-center mt-6 pb-8">
          <div className="w-full bg-white rounded-t-[40px] pb-16">
            <h2 className="pt-6 pb-4 text-[1.8rem] font-extrabold text-center">
              {certificate.title}
            </h2>
            <hr className="border-t border-gray-200" />

            {/* 기본 정보 */}
            <section className="mt-8 px-8 space-y-6">
              <h3 className="flex items-center gap-3 text-[1.5rem] font-semibold">
                <InfoIcon width={1.6} height={1.6} color="#6000FF" />
                기본 정보
              </h3>
              <div className="grid grid-cols-[98px_1fr] pl-6 rounded-[20px] border border-gray-300">
                <Image
                  src="/certificate.png"
                  alt="미리보기"
                  width={98}
                  height={120}
                  className="object-cover mt-7"
                />
                <div className="border-l ml-8 border-gray-300 flex flex-col">
                  <div className="p-4 border-b border-gray-200 text-[1.25rem]">
                    <p className="font-semibold">보낸 사람</p>
                    <p className="mt-2">이름: {certificate.sender.name}</p>
                    <p>주소: {certificate.sender.address}</p>
                    <p>상세 주소: {certificate.sender.detailAddress}</p>
                  </div>
                  <div className="p-4 border-b border-gray-200 text-[1.25rem]">
                    <p className="font-semibold">받는 사람</p>
                    <p className="mt-2">이름: {certificate.receiver.name}</p>
                    <p>주소: {certificate.receiver.address}</p>
                    <p>상세 주소: {certificate.receiver.detailAddress}</p>
                  </div>
                  <div className="p-4 text-[1.25rem]">
                    작성일:{" "}
                    {certificate.createdDate.split("T").join(" ").slice(0, -5)}
                  </div>
                </div>
              </div>
            </section>

            {/* 요약 */}
            <section className="mt-10 px-8 space-y-6">
              <h3 className="flex items-center gap-3 text-[1.5rem] font-semibold">
                <AnalysisIcon width={1.6} height={1.6} color="#6000FF" />
                내용 요약
              </h3>
              <p className="border border-gray-300 p-6 rounded-[20px] leading-[1.55] text-[1.2rem] whitespace-pre-wrap">
                {certificate.strategySummary}
              </p>
            </section>

            {/* AI 추천 */}
            {/* <section className="mt-10 px-8 space-y-6">
              <h3 className="flex items-center gap-3 text-[1.5rem] font-semibold">
                <MagicTwoStarIcon width={1.6} height={1.6} color="#6000FF" />
                AI 추천
              </h3>
              <div className="flex gap-6">
                <button className="flex-1 flex flex-col items-center gap-4 py-6 rounded-[20px] border border-[#E5E5EA]">
                  <Image src="/!아이콘.png" width={12} height={22} alt="" />
                  <span className="text-[1.35rem] font-semibold">
                    다음 전략
                  </span>
                </button>
                <button className="flex-1 flex flex-col items-center gap-4 py-6 rounded-[20px] border border-[#E5E5EA]">
                  <Image src="/openBook.png" width={22} height={24} alt="" />
                  <span className="text-[1.35rem] font-semibold">
                    유사 판례
                  </span>
                </button>
              </div>
            </section> */}
          </div>
          <div className="flex items-center justify-center flex-col gap-8 w-full px-8">
            <SubmitButton
              width="100%"
              height={5.5}
              fontSize={1.8}
              fontWeight={600}
              onClick={() => {
                console.log(certificate);
                setOpenOriginal(true);
              }}
            >
              전문 보기
            </SubmitButton>
            {/* <button
              className="w-full flex items-center justify-center px-8 py-6 rounded-[20px] text-[#6000ff] !text-[1.4rem] border border-[#6000ff] bg-white"
              onClick={() => {
                setOpenSend(true);
                setSendStep(1);
              }}
            >
              <DocumentIcon />
              &nbsp;내용증명서 초안 이메일로 전송하기
            </button> */}
          </div>
        </main>
      )}

      <Modal
        isOpen={openOriginal}
        setIsOpen={setOpenOriginal}
        clickOutsideClose={true}
        isCenter={true}
      >
        {/* 슬라이드 #0 : 원본 */}
        <div
          ref={containerRef}
          className="overflow-x-auto whitespace-nowrap snap-x snap-mandatory"
        >
          <div
            className="
            inline-block w-[90%]
            h-[80svh] snap-x snap-mandatory bg-white rounded-[40px] shadow
            py-8 px-2 mx-7
            overflow-y-auto
            "
          >
            <div className="relative flex items-center px-6 py-4">
              <h3 className="absolute left-1/2 -translate-x-1/2 text-[1.7rem] font-bold">
                내용증명서
              </h3>
              <div className="ml-auto">
                <Image
                  src="/no.png"
                  alt="닫기"
                  width={24}
                  height={24}
                  onClick={() => setOpenOriginal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label="닫기"
                />
              </div>
            </div>

            {/* 본문 (스크롤 처리) */}
            <div className="px-6 py-4 flex-1 overflow-y-auto whitespace-pre-line text-[1.2rem]">
              <ReactMarkdown>{certificate?.body}</ReactMarkdown>
            </div>
            {/* ─── 경고 박스 ─── */}
            <div
              className="
            flex p-3
            w-[90%]
            bg-[#fefce8]
            rounded-[40px]
            items-center
            text-sm"
            >
              <Image
                src="/warning.png"
                alt="warningIcon"
                width={27}
                height={26}
                className="flex-shrink-0 ml-4"
              />
              <span className="text-subText font-normal whitespace-break-spaces">
                이 문서는 법률 상담 또는 분쟁 조정을 위한 사전 통지용 문서이며,
                실제 소송 등 법적 절차에 참고될 수 있습니다.
              </span>
            </div>
          </div>
          {/* ── 관련 법률 모달 ── */}
          {/* 헤더 */}
          {certificate?.legalBasis.length && (
            <ul className="inline-flex flex-col w-[90%] max-h-[80svh] bg-white rounded-[40px] shadow py-8 px-2 mx-7 overflow-y-auto align-top">
              <div className="w-full px-12 flex items-center gap-12 justify-between">
                <ScalesIcon width={2} height={2} color="#6000FF" />
                <h3 className="text-[1.7rem] font-bold">관련 법률</h3>
                <Image
                  src="/no.png"
                  alt="닫기"
                  width={24}
                  height={24}
                  onClick={() => setOpenOriginal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="닫기"
                />
              </div>
              {certificate?.legalBasis.map(({ lawId, law, explanation }) => (
                <li
                  key={lawId}
                  className="
                relative flex-1
                rounded-[20px]
                border border-gray-100
                overflow-y-auto 
                whitespace-pre-line  
                leading-relaxed"
                >
                  <div>
                    <div
                      className="
                      border border-gray-100 
                      rounded-[20px] p-4 text-[1.2rem]
                      text-gray-500"
                    >
                      {law}
                    </div>
                    <div className="p-5">{explanation}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={openSend}
        setIsOpen={setOpenSend}
        clickOutsideClose
        isCenter={false}
      >
        <div
          className="bg-white w-[90vw] max-w-md rounded-t-[40px] mx-auto"
          style={{
            transform: `translateY(${dragY}px)`,
            transition:
              dragY === 0 ? "transform 0.18s cubic-bezier(.4,2,.6,1)" : "",
          }}
        >
          <div
            className="mx-auto mt-3 mb-4 w-16 h-1.5 rounded-full bg-gray-300 cursor-pointer active:bg-gray-400"
            ref={handleRef}
            onPointerDown={onDragStart}
            onTouchStart={onDragStart}
          />
          {/* STEP 1: 이메일 입력 */}
          {sendStep === 1 && (
            <>
              <h3 className="px-6 text-center text-[1.9rem] font-bold mt-8">
                전송할 이메일 주소를 입력해주세요
              </h3>
              <p className="text-center text-[1.2rem] text-[#6000FF] font-medium">
                내용증명서 초안을 전송해 드릴게요
              </p>
              <div className="mt-10">
                <StyledInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력 해주세요"
                  underLine={false}
                  className="
                    border border-gray-300
                    w-full h-20 rounded-[40px] px-4
                    text-[1.3rem] pt-5.5 pl-10
                    "
                />
              </div>
              <div className="px-15 mt-6 mb-15">
                <button
                  className="w-full py-5 rounded-[40px] bg-[#6000FF] text-white !font-semibold !text-[1.5rem] disabled:bg-[rgba(128,128,128,0.55)]"
                  disabled={!emailValid}
                  // 여기에 작동 코드
                  onClick={handleSend}
                >
                  다음
                </button>
              </div>
            </>
          )}
          {/* STEP 2: 전송 완료 안내 */}
          {sendStep === 2 && (
            <div className="w-full p-16 flex flex-col gap-8">
              <div className="text-[2rem] font-bold text-center">
                내용증명서 초안이 발송되었습니다
              </div>
              <div className="flex justify-center items-center">
                <GreenLogoIcon width={8} height={8} color="#32d74b" />
              </div>
              <div className="flex w-full gap-8 justify-between">
                <SubmitButton
                  width={16}
                  height={5}
                  fontSize={1.6}
                  fontWeight={500}
                  fontColor="#1e1e1e"
                  background="white"
                  borderColor="#5c5c5c"
                  onClick={() => {
                    setEmail("");
                    setOpenSend(false);
                    setSendStep(1);
                    router.push("/");
                  }}
                >
                  홈 화면으로
                </SubmitButton>
                <SubmitButton
                  width={16}
                  height={5}
                  fontSize={1.6}
                  fontWeight={500}
                  onClick={() => {
                    setEmail("");
                    setOpenSend(false);
                    setSendStep(1);
                  }}
                >
                  확인
                </SubmitButton>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
