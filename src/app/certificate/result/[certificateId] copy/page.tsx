// app/main/certificate/result/page.tsx
"use client";

import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import BackHeader from "@/components/BackHeader";
import InfoIcon from "@/components/icons/Info";
import AnalysisIcon from "@/components/icons/Analysis";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import Modal from "@/components/Modal";
import ScalesIcon from "@/components/icons/Scales";
import clientApi from "@/lib/axios.client";
import ZoomableCertification, {
  CertificationProps,
} from "./ZoomableCertification";

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

function CertificatePage(props: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = use(props.params);
  const [openOriginal, setOpenOriginal] = useState(false);
  const [certificate, setCertificate] = useState<Certificate>();
  // const [certificationPropsVariable, setCertificationPropsVariable] =
  //   useState<CertificationProps>();
  const [openSend, setOpenSend] = useState(false);
  const [sendStep, setSendStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [zoom, setZoom] = useState(false);
  const router = useRouter();

  const data = {
    _id: "6862dac93bea9a55bfd8c458",
    userId: "685c92d1d23a2477f648b5e8",
    contractId: "6862c40d3bea9a55bfd8c265",
    createdDate: "2025-06-30T09:43:21.926Z",
    title: "보증금 반환 촉구서",
    receiver: {
      name: "미상",
      address: "미상",
      detailAddress: "",
    },
    sender: {
      name: "미상",
      address: "미상",
      detailAddress: "",
    },
    body: "수신인께\n\n저는 귀하와 체결한 임대차계약의 임차인으로서, 계약 만료에 따른 보증금 반환을 정중히 요구하고자 이 서면을 발송합니다.\n\n■ 계약 관련 사실관계\n\n1. 계약 당사자: 임대인 귀하, 임차인 저\n2. 계약 유형: 전세계약\n3. 계약 기간: ~ (계약 만료)\n4. 보증금: 0원\n5. 임대 부동산: ()\n\n■ 현재 상황 및 문제점\n\n상기 임대차계약이 계약기간 만료로 종료되었음에도 불구하고, 귀하께서는 아직까지 보증금을 반환하지 않고 계십니다. 저는 계약 종료와 함께 임대 부동산을 원상회복하여 명도하였으며, 보증금 반환을 위한 모든 조건을 충족하였습니다.\n\n■ 법적 근거\n\n임대차계약에서 보증금은 임차인이 임대인에게 임차보증금반환채무의 담보로 제공한 금원으로, 계약 종료 시 임대인은 이를 즉시 반환할 의무가 있습니다. 이는 민법상 임대차 관계의 기본 원칙이며, 선량한 관리자의 주의의무에 따른 당연한 법적 의무입니다.\n\n■ 요구사항\n\n이에 저는 귀하께 다음과 같이 요구합니다:\n\n1. 상기 보증금 전액의 즉시 반환\n2. 반환 지연에 따른 법정이자 또는 손해배상\n3. 향후 원만한 해결을 위한 성실한 협의\n\n■ 이행 기한 및 해결 방안\n\n귀하께서는 이 서면을 수령한 날로부터 7일 이내에 상기 보증금을 반환하여 주시기 바랍니다. 만약 즉시 반환이 어려운 사정이 있으시다면, 구체적인 반환 계획을 서면으로 통지하여 주시기 바라며, 저 또한 합리적인 범위에서 협의에 응할 용의가 있습니다.\n\n■ 미이행 시 후속 조치\n\n만약 상기 기한 내에 보증금 반환이나 합리적인 해결 방안 제시가 없을 경우, 저는 부득이하게 다음과 같은 법적 조치를 취할 수밖에 없음을 미리 알려드립니다:\n\n1. 민사소송을 통한 보증금 반환 청구\n2. 지연손해금 및 소송비용 청구\n3. 기타 법률이 허용하는 모든 구제 수단 활용\n\n■ 맺음말\n\n저는 귀하와의 불필요한 분쟁을 원하지 않으며, 상호 합리적인 협의를 통해 원만히 해결되기를 진심으로 희망합니다. 귀하의 성실한 이행을 기대하며, 빠른 시일 내에 긍정적인 답변을 주시기 바랍니다.\n\n감사합니다.\n\n2024년 12월 19일\n\n발신인: 미상 (인)",
    strategySummary:
      "계약 만료 후 보증금 미반환 상황에 대해 정중하면서도 단호한 어조로 법적 근거를 제시하며 7일 이내 반환을 요구하되, 협의 가능성을 열어두어 원만한 해결을 도모하는 전략을 채택했습니다.",
    followupStrategy:
      "7일 후에도 반환이나 합리적 제안이 없을 경우 민사소송 준비에 착수하되, 그 전에 한 번 더 전화나 문자로 최종 협의 의사를 확인해보시기 바랍니다. 또한 임대차계약서, 보증금 입금 증빙, 명도 완료 증거자료 등을 미리 정리해두시기 바랍니다.",
    legalBasis: [],
    caseBasis: [
      {
        caseId: 1634,
        case: "임대차보증금 (99가단2476)",
        explanation:
          "임대차계약이 종료되면 임대인은 임차인에게 보증금을 반환할 법적 의무가 발생합니다. 이는 민법상 당연한 채무로서, 계약 만료와 동시에 반환청구권이 성립됩니다.",
        link: "data/case/1634",
      },
      {
        caseId: 447,
        case: "임대차보증금 (98가합103706)",
        explanation:
          "이 판례는 상가 임대차계약에서 임차보증금 7,700만원으로 계약을 체결했으나, 계약 종료 후 보일러 수리비 중 일부를 임차인이 부담하기로 합의하여 보증금을 7,350만원으로 조정한 사례입니다. 법원은 임대차계약 종료 시 임차보증금 반환 의무가 발생한다는 기본 원칙을 확인하고 있습니다.",
        link: "data/case/447",
      },
      {
        caseId: 1636,
        case: "임대차보증금 (2023가단73918)",
        explanation:
          "임대차 계약이 기간 만료로 종료된 경우 임대인은 보증금을 반환할 의무가 있으나, 임차인이 건물을 실제로 인도(반환)하지 않은 상태에서는 보증금 반환의무와 건물 인도의무가 동시이행관계에 있어 지연손해금은 발생하지 않는다고 판단했습니다. 다만 임대인이 별도로 대출이자 지급을 약정한 경우 이에 대한 손해배상 책임은 인정될 수 있습니다.",
        link: "data/case/1636",
      },
    ],
    certificationMetadata: {
      model: "Claude Sonnet 4",
      generationTime: 41.64,
      userAgent: "Mozilla",
      version: "v1.2.3",
    },
    userQuery:
      "보증금 반환\n계약 만료임에도 보증금 반환해주지 않아 내용 증명 보냄",
    __v: 0,
    id: "6862dac93bea9a55bfd8c458",
  };

  const getCertificate = async () => {
    const response = await clientApi.post("/certificate", {
      certificateId,
    });
    console.log("response");
    console.log(response);
    console.log("response.data");
    console.log(response.data);

    if (response.data) {
      setCertificate(response.data);
    } else {
      alert("존재하지 않는 페이지입니다.");
      router.replace("/");
    }
  };
  useEffect(() => {
    // getCertificate();
    setCertificate(data);
  }, []);

  return (
    <>
      <div
        onClick={() => setZoom(!zoom)}
        className={zoom ? " scroll-auto z-50 bg-white" : "hidden"}
      >
        {/* <ContentCertification data={data} /> */}
        <ZoomableCertification data={certificate as CertificationProps} />
      </div>
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
              {/* <div className="flex h-screen w-full"> */}
              <div className="flex w-full border rounded-[20px] border-gray-300">
                <div className="flex-1 px-4 flex items-center justify-center">
                  <Image
                    src="/certificate.png"
                    alt="미리보기"
                    width={20000}
                    height={20}
                    className="object-cover mt-7"
                    onClick={() => setZoom(!zoom)}
                  />
                </div>
                <div className="w-[1px] gray-300 h-full" />
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex justify-between ">
                    <div className="border-gray-300 flex flex-col">
                      <div className="p-4 border-b border-gray-200 text-[1.25rem]">
                        <p className="font-semibold">보낸 사람</p>
                        <p className="mt-2">이름: {certificate.sender.name}</p>
                        <p>주소: {certificate.sender.address}</p>
                        <p>상세 주소: {certificate.sender.detailAddress}</p>
                      </div>
                      <div className="p-4 border-b border-gray-200 text-[1.25rem]">
                        <p className="font-semibold">받는 사람</p>
                        <p className="mt-2">
                          이름: {certificate.receiver.name}
                        </p>
                        <p>주소: {certificate.receiver.address}</p>
                        <p>상세 주소: {certificate.receiver.detailAddress}</p>
                      </div>
                      <div className="p-4 text-[1.25rem]">
                        작성일:{" "}
                        {certificate.createdDate
                          .split("T")
                          .join(" ")
                          .slice(0, -5)}
                      </div>
                    </div>
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
                전문 보기
              </SubmitButton>
            </div>
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
        {/* <div
          className="
            inline-block w-[88%] max-w-md
            h-full snap-x snap-mandatory bg-white rounded-[40px] shadow
            align-top ml-8 overflow-y-auto
            "
        > */}
        <div
          className="
            inline-block w-[88%] max-w-md
            h-[90svh] snap-x snap-mandatory bg-white rounded-[40px] shadow
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
      <Modal
        isOpen={openSend}
        setIsOpen={setOpenSend}
        clickOutsideClose
        isCenter={false}
      >
        <div className="bg-white w-[90vw] max-w-md rounded-t-[40px] mx-auto">
          {/* -------------- STEP 1 : 이메일 입력 -------------- */}
          {sendStep === 1 && (
            <>
              {/* 드래그 핸들(디자인용) */}
              <div className="mx-auto mt-3 mb-4 w-16 h-1.5 rounded-full bg-gray-300" />

              <h3 className="px-6 text-center text-[1.9rem] font-bold mt-8">
                전송할 이메일 주소를 입력해주세요
              </h3>
              <p className="text-center text-[1.2rem] text-[#6000FF] font-medium">
                완성된 내용증명서를 전송해 드릴게요
              </p>
              <div className="px-6 mt-10">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력 해주세요"
                  className="
                    border border-gray-300 bg-white pl-10
                    w-full h-20 rounded-[40px] px-4
                    text-[1.3rem] 
                  "
                />
              </div>

              {/* 다음 버튼 */}
              <div className="px-6 mt-6 ml-4 mb-15 ">
                <SubmitButton
                  width={30}
                  height={5}
                  disabled={!emailValid}
                  onClick={() => setSendStep(2)}
                >
                  다음
                </SubmitButton>
              </div>
            </>
          )}

          {/* -------------- STEP 2 : 전송 확인 -------------- */}
          {sendStep === 2 && (
            <>
              {/* 헤더 */}
              <div className="flex items-center px-6 py-5 justify-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-[1.9rem] font-bold mt-8">
                    내용증명서 발송이 완료되었습니다
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/greenlogo.svg"
                  alt="닫기"
                  width={65}
                  height={65}
                  className="items-center mt-6 mb-15"
                  onClick={() => setOpenSend(false)}
                />
              </div>

              {/* 버튼 */}
              <div className="grid grid-cols-2 gap-8 px-6 pb-8 text-[1.6rem]">
                <button
                  className="
                    w-[160px] h-[50px] border border-gray-600
                    rounded-[40px] -ml-4"
                  onClick={() => setOpenSend(false)}
                >
                  다시 전송하기
                </button>
                <button
                  className="
                    w-[160px] h-[50px] border-none bg-[#6000FF]
                    rounded-[40px] text-white"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  홈 화면으로
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={openSend}
        setIsOpen={setOpenSend}
        clickOutsideClose
        isCenter={false}
      >
        <div className="bg-white w-[90vw] max-w-md rounded-t-[40px] mx-auto">
          {/* -------------- STEP 1 : 이메일 입력 -------------- */}
          {sendStep === 1 && (
            <>
              {/* 드래그 핸들(디자인용) */}
              <div className="mx-auto mt-3 mb-4 w-16 h-1.5 rounded-full bg-gray-300" />

              <h3 className="px-6 text-center text-[1.9rem] font-bold mt-8">
                전송할 이메일 주소를 입력해주세요
              </h3>
              <p className="text-center text-[1.2rem] text-[#6000FF] font-medium">
                완성된 내용증명서를 전송해 드릴게요
              </p>
              <div className="px-6 mt-10">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력 해주세요"
                  className="
                    border border-gray-300 bg-white pl-10
                    w-full h-20 rounded-[40px] px-4
                    text-[1.3rem] 
                  "
                />
              </div>

              {/* 다음 버튼 */}
              <div className="px-6 mt-6 ml-4 mb-15 ">
                <SubmitButton
                  width={30}
                  height={5}
                  disabled={!emailValid}
                  onClick={() => setSendStep(2)}
                >
                  다음
                </SubmitButton>
              </div>
            </>
          )}

          {/* -------------- STEP 2 : 전송 확인 -------------- */}
          {sendStep === 2 && (
            <>
              {/* 헤더 */}
              <div className="flex items-center px-6 py-5 justify-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-[1.9rem] font-bold mt-8">
                    내용증명서 발송이 완료되었습니다
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/greenlogo.svg"
                  alt="닫기"
                  width={65}
                  height={65}
                  className="items-center mt-6 mb-15"
                  onClick={() => setOpenSend(false)}
                />
              </div>

              {/* 버튼 */}
              <div className="grid grid-cols-2 gap-8 px-6 pb-8 text-[1.6rem]">
                <button
                  className="
                    w-[160px] h-[50px] border border-gray-600
                    rounded-[40px] -ml-4"
                  onClick={() => setOpenSend(false)}
                >
                  다시 전송하기
                </button>
                <button
                  className="
                    w-[160px] h-[50px] border-none bg-[#6000FF]
                    rounded-[40px] text-white"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  홈 화면으로
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export default CertificatePage;
