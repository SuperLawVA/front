// app/main/certificate/result/page.tsx
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import BackHeader from "@/components/BackHeader";
import InfoIcon from "@/components/icons/Info";
import AnalysisIcon from "@/components/icons/Analysis";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import Modal from "@/components/Modal";
import ScalesIcon from "@/components/icons/Scales";
import axios from "axios";

export interface Certificate {
  _id: string; // 고유 ID (문자열)
  userId: number; // 사용자 ID
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

export default function CertificateResult() {
  const [openOriginal, setOpenOriginal] = useState(false);
  const [certificate, setCertificate] = useState<Certificate>();
  useEffect(() => {
    const getCertificate = async (
      contractId: string,
      certificateId: string
    ) => {
      const response = await axios.post("/api/certificate/result", {
        contractId,
        certificateId,
      });

      if (response.data) {
        setCertificate(response.data);
      }
    };

    getCertificate("101", "123");
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#F4F4F6]">
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
                      작성일: {certificate.createdDate}
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
              <section className="mt-10 px-8 space-y-6">
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
              </section>

              {/* 원본보기 → 모달 열기 */}
              <div className="px-8 mt-12">
                <SubmitButton
                  width="100%"
                  height={5.5}
                  fontSize={1.8}
                  fontWeight={600}
                  onClick={() => setOpenOriginal(true)}
                >
                  원본보기
                </SubmitButton>
              </div>
            </div>
          </main>
        )}
      </div>

      <Modal
        isOpen={openOriginal}
        setIsOpen={setOpenOriginal}
        clickOutsideClose={true}
        isCenter={true}
      >
        {/* 슬라이드 #0 : 원본 */}
        <div
          className="
            inline-block w-[88%] max-w-md
            h-full snap-x snap-mandatory bg-white rounded-[40px] shadow
            align-top ml-8 overflow-y-auto
            "
        >
          <div className="flex-none flex items-center justify-between px-6 py-4">
            <h3 className="text-[1.7rem] ml-50 mt-8 font-bold">내용증명서</h3>
            <Image
              src="/no.png"
              alt="닫기"
              width={24}
              height={24}
              onClick={() => setOpenOriginal(false)}
              className="mt-4 mr-8 text-gray-500 hover:text-gray-700"
              aria-label="닫기"
            />
          </div>
          {/* 본문 (스크롤 처리) */}
          <div className="px-6 py-4 mt-6 flex-1 overflow-y-auto whitespace-pre-line text-[0.95rem] leading-relaxed">
            {certificate?.body}
          </div>
          {/* ─── 경고 박스 ─── */}
          <div
            className="
            flex p-3
            mx-6 my-4
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
            <div className="ml-6">
              <span className="text-subText font-normal">
                이 문서는 법률 상담 또는 분쟁 조정을 위한 사전 통지용 문서이며,
                <br />
                실제 소송 등 법적 절차에 참고될 수 있습니다.
              </span>
            </div>
          </div>
        </div>

        {/* ── 관련 법률 모달 ── */}

        {/* 헤더 */}
        <ul
          className="
            inline-block 
            w-[88%] h-full
            items-center 
            overflow-y-auto
            bg-white rounded-[40px] 
            px-6 py-4 ml-5 mr-8"
        >
          <div className="relative flex flex-col">
            <div className="absolute mt-8 ml-45">
              <ScalesIcon width={2} height={2} color="#6000FF" />
            </div>
            <h3 className="absolute pl-2 mt-7 ml-55 text-[1.7rem] font-bold">
              관련 법률
            </h3>
            <Image
              src="/no.png"
              alt="닫기"
              width={24}
              height={24}
              onClick={() => setOpenOriginal(false)}
              className="mt-6 ml-[28rem] text-gray-500 hover:text-gray-700"
              aria-label="닫기"
            />
          </div>
          {certificate?.legalBasis.map(({ lawId, law, explanation }) => (
            <li
              key={lawId}
              className="
                relative flex-1
                mt-40 rounded-[20px]
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
      </Modal>
    </>
  );
}
