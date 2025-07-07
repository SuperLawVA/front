"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import BulbIcon from "@/components/icons/Bulb";
import DivBox from "@/components/DivBox";
import { useCreateStore } from "@/store/useStore";
import QuestionMarkIcon from "@/components/icons/QuestionMark";
import Image from "next/image";
import DocumentIcon from "@/components/icons/Document";
import Modal from "@/components/Modal";

function ContractCreateNewPage() {
  const router = useRouter();
  const [contractId, setContractId] = useState("");
  const [legaBasis, setLegaBasis] = useState<
    {
      lawId: number;
      law: string;
      explanation: string;
      content: string;
    }[]
  >([]);
  const [caseBasis, setCaseBasis] = useState<
    {
      caseId: number;
      case: string;
      explanation: string;
      link: string;
    }[]
  >([]);
  const [agreements, setAgreements] = useState<
    {
      reason: string;
      suggestedRevision: string;
      negotiationPoints: string;
    }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [contractTitle, setContractTitle] = useState<string>("");

  useEffect(() => {
    const { contractTitle, legalBasis, agreements, contractId, caseBasis } =
      useCreateStore.getState();
    if (!contractId) router.replace("/");
    setAgreements(agreements);
    setContractTitle(contractTitle as string);
    setLegaBasis(legalBasis);
    setCaseBasis(caseBasis);
    setContractId(contractId as string);
    console.log(useCreateStore.getState());
  }, [router]);

  const [lawModalOpen, setLawModalOpen] = useState(false);
  const [caseModalOpne, setCaseModalOpne] = useState(false);
  const [openedLaw, setOpenedLaw] = useState<number[]>([]);

  const toggleLaw = (idx: number) => {
    setOpenedLaw((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  useEffect(() => {
    if (lawModalOpen) setOpenedLaw([]);
  }, [lawModalOpen]);

  const liArray = agreements.map(({ suggestedRevision }, index) => (
    <li
      key={index}
      className="w-full h-20 px-10 py-6  flex items-center text-[1.4rem] text-[#3a3a40] font-medium border border-[#d7d7d7] rounded-[50px] bg-white"
    >
      <div className="w-8 flex justify-center items-center flex-shrink-0">
        {activeIndex === 0 ? (
          <ArrowLeftIcon
            color="white"
            className="cursor-not-allowed pointer-events-none"
          />
        ) : (
          <ArrowLeftIcon
            width={1.5}
            height={1.5}
            onClick={() => setActiveIndex(activeIndex - 1)}
            className="z-10 cursor-pointer"
          />
        )}
      </div>
      <div className="flex items-center gap-4 px-4 flex-grow overflow-hidden">
        <span className="w-[1.6rem] h-[1.6rem] flex justify-center items-center bg-main text-white rounded-[50px] text-[1rem] flex-shrink-0">
          {index + 1}
        </span>
        <span className="truncate">{suggestedRevision}</span>
      </div>
      <div className="w-8 flex justify-center items-center flex-shrink-0">
        {activeIndex === agreements.length - 1 ? (
          <ArrowRightIcon
            color="white"
            className="cursor-not-allowed pointer-events-none"
          />
        ) : (
          <ArrowRightIcon
            width={1.5}
            height={1.5}
            onClick={() => setActiveIndex(activeIndex + 1)}
            className="z-10 cursor-pointer"
          />
        )}
      </div>
    </li>
  ));

  const contents = agreements.map(
    ({ suggestedRevision, reason, negotiationPoints }, index) => (
      <li
        key={index}
        className="w-full flex flex-col gap-8 justify-center items-center"
      >
        <div className="w-full flex flex-col gap-4 items-start">
          <span className="w-full px-8 flex gap-4 items-center text-[1.8rem] text-[#0f0f0f] font-semibold">
            <MagicTwoStarIcon width={1.6} height={1.6} color="#6000FF" />
            생성된 특약
          </span>
          <DivBox
            className="w-full text-center px-7 py-6"
            style={{
              backgroundColor: "rgb(242, 238, 251)",
              border: "1px solid #6000FF",
            }}
          >
            {suggestedRevision}
          </DivBox>
        </div>
        <div className="w-full flex flex-col gap-4 items-start">
          <span className="px-8 flex gap-4 items-center text-[1.8rem] text-[#0f0f0f] font-semibold">
            <QuestionMarkIcon color="#6000FF" />
            이유
          </span>
          <DivBox className="w-full flex items-center px-7 py-6">
            {reason}
          </DivBox>
        </div>
        <div className="w-full flex flex-col gap-4 items-start">
          <span className="w-full px-8 flex gap-4 items-center text-[1.8rem] text-[#0f0f0f] font-semibold">
            <BulbIcon color="#6000FF" />
            협상 방안
          </span>
          <DivBox className="w-full flex items-center px-7 py-6">
            {negotiationPoints}
          </DivBox>
        </div>
      </li>
    )
  );

  return (
    <>
      <div className="h-20 mt-15 w-full flex flex-col justify-center items-center">
        {contractTitle && (
          <BackHeader to="/">{contractTitle + " 작성"}</BackHeader>
        )}
      </div>
      <main className="w-full flex flex-col items-center mt-[2.5rem] gap-12 min-h-[calc(100%-11rem)]">
        <ul className="px-8 py-12 w-full flex-1 bg-white rounded-t-[40px] backdrop-opacity-70 flex flex-col gap-12 items-center">
          {/* map으로 묶기 */}
          {contents[activeIndex]}
          <div className="flex gap-10 w-full">
            <button
              className="flex-1 flex flex-col items-center gap-4 py-6 rounded-[20px] border border-[#E5E5EA]"
              onClick={() => setLawModalOpen(true)}
              type="button"
            >
              <Image src="/scales.svg" width={30} height={24} alt="" />
              <span className="text-[1.5rem] font-semibold">관련 법률</span>
            </button>
            <button
              className="flex-1 flex flex-col items-center gap-4 py-6 rounded-[20px] border border-[#E5E5EA]"
              onClick={() => setCaseModalOpne(true)}
              type="button"
            >
              <Image src="/openBook.svg" width={30} height={24} alt="" />
              <span className="text-[1.5rem] font-semibold">유사 판례</span>
            </button>
          </div>
          <button
            onClick={() => router.push("/contract/" + contractId)}
            className="flex items-center justify-center px-20 py-5 rounded-[20px] text-[#6000ff] !text-[1.8rem] border border-[#6000ff]"
          >
            <DocumentIcon />
            &nbsp; 완성된 계약서 보기
          </button>
          <div className="w-full">{liArray && liArray[activeIndex]}</div>
        </ul>
      </main>
      <Modal
        isOpen={lawModalOpen}
        setIsOpen={setLawModalOpen}
        clickOutsideClose={true}
      >
        <div className="mx-auto mt-6 mb-4 w-20 h-1.5 rounded-full bg-gray-300" />
        <div className="flex flex-col items-center py-4 pb-12 px-10 w-full">
          <span className="text-[2rem] font-medium text-center mb-8">
            전체 특약 관련 법률
          </span>
          <div className="w-full max-h-[47rem] overflow-y-auto">
            <ul className="w-full flex flex-col gap-4">
              {!legaBasis || legaBasis.length === 0 ? (
                <li
                  key={-1}
                  className="bg-white rounded-[20px] border border-[#ededed] transition-all"
                >
                  <div className="flex justify-center items-center w-full px-6 py-5 !text-[1.4rem] !text-subText font-medium focus:outline-none">
                    생성된 특약과 관련된 법률이 없습니다
                  </div>
                </li>
              ) : (
                legaBasis.map(({ law, explanation }, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-[20px] border border-[#ededed] transition-all"
                  >
                    <button
                      type="button"
                      className="flex justify-between items-center w-full px-6 py-5 !text-[1.4rem] font-medium focus:outline-none"
                      onClick={() => toggleLaw(idx)}
                    >
                      <span className="text-left text-[#222]">{law}</span>
                      <Image
                        src="/add.svg"
                        alt="펼치기"
                        width={24}
                        height={24}
                        className={`w-6 h-6 transition-transform duration-200 ${
                          openedLaw.includes(idx) ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {/* 펼쳐졌을 때만 내용 표시 */}
                    {openedLaw.includes(idx) && (
                      <div className="px-6 py-4 bg-[#fafafd] rounded-b-[20px] text-[1.2rem] text-gray-700 border-t border-[#ededed] animate-fadein">
                        {/* 여기에 law.content 혹은 상세 내용 */}
                        {explanation}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={caseModalOpne}
        setIsOpen={setCaseModalOpne}
        clickOutsideClose={true}
      >
        <div className="mx-auto mt-6 mb-4 w-20 h-1.5 rounded-full bg-gray-300" />
        <div className="flex flex-col items-center py-4 pb-12 px-10 w-full">
          <span className="text-[2rem] font-medium text-center mb-8">
            전체 특약 관련 판례
          </span>
          <div className="w-full max-h-4/5 overflow-y-auto">
            <ul className="w-full flex flex-col gap-4">
              {!caseBasis || caseBasis.length === 0 ? (
                <li
                  key={-1}
                  className="bg-white rounded-[20px] border border-[#ededed] transition-all"
                >
                  <div className="flex justify-center items-center w-full px-6 py-5 !text-[1.4rem] !text-subText font-medium focus:outline-none">
                    생성된 특약과 유사한 판례가 없습니다
                  </div>
                </li>
              ) : (
                caseBasis.map(({ case: caseName, explanation }, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-[20px] border border-[#ededed] transition-all"
                  >
                    <button
                      type="button"
                      className="flex justify-between items-center w-full px-6 py-5 !text-[1.4rem] font-medium focus:outline-none"
                      onClick={() => toggleLaw(idx)}
                    >
                      <span className="text-left text-[#222]">{caseName}</span>
                      <Image
                        src="/add.svg"
                        alt="펼치기"
                        width={24}
                        height={24}
                        className={`w-6 h-6 transition-transform duration-200 ${
                          openedLaw.includes(idx) ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {/* 펼쳐졌을 때만 내용 표시 */}
                    {openedLaw.includes(idx) && (
                      <div className="px-6 py-4 bg-[#fafafd] rounded-b-[20px] text-[1.2rem] text-gray-700 border-t border-[#ededed] animate-fadein">
                        {/* 여기에 law.content 혹은 상세 내용 */}
                        {explanation}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ContractCreateNewPage;
