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
import ScalesIcon from "@/components/icons/Scales";

function ContractCreateNewPage() {
  const router = useRouter();
  // const [inputValue, setInputValue] = useState<string>("");
  const [userQuery, setUserQuery] = useState<string[]>();
  // const [userQuery, setUserQuery] = useState<string[]>([
  //   "집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요",
  //   "집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요",
  //   "벽에 선반 달고 싶어요",
  //   "집에서 담배 피고 싶어요",
  //   "집에서 친구랑 동거하고 싶어요",
  //   "집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요집에서 친구랑 동거하고 싶어요",
  // ]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  useEffect(() => {
    //   if (!sessionStorage.getItem("contractData")) {
    //     router.replace("/create");
    //   } else if (!sessionStorage.getItem("articleAgree")) {
    //     router.replace("step2");
    //   } else if (!sessionStorage.getItem("userQuery")) {
    //     router.replace("step3");
    //   }
    //   sessionStorage.removeItem("createStore");
    const contractData = useCreateStore.getState();
    setUserQuery(contractData.userQuery);
  }, [router]);

  const [lawModalOpen, setLawModalOpen] = useState(false);  // "관련 법률" 모달
  const [openedLaw, setOpenedLaw] = useState<number[]>([]);


  const toggleLaw = (idx: number) => {
  setOpenedLaw(prev =>
    prev.includes(idx)
      ? prev.filter(i => i !== idx) // 이미 열려있으면 닫기
      : [...prev, idx] // 닫혀있으면 열기
  );
};

  const laws = [

  { title: "소득세법 시행령 제122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  { title: "소득세법 시행령 제 122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  { title: "소득세법 시행령 제 122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  { title: "소득세법 시행령 제 122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  { title: "소득세법 시행령 제 122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  { title: "소득세법 시행령 제 122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  { title: "소득세법 시행령 제 122조 제 1항"},
  { title: "조세특례제한법 시행령 제 96조 제 2항"},
  
];

  const liArray = userQuery?.map((value, index) => (
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
        <span className="truncate">{value}</span>
      </div>
      <div className="w-8 flex justify-center items-center flex-shrink-0">
        {activeIndex === userQuery.length - 1 ? (
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

  useEffect(() => {
  if (lawModalOpen) setOpenedLaw([]);
}, [lawModalOpen]);

  return (
    <>
      <div className="h-20 mt-15 w-full flex flex-col justify-center items-center" />
      <BackHeader to="/">임대차 계약서 작성</BackHeader>
      <main className="flex flex-col items-center mt-[2.5rem] gap-12 h-[calc(100%-11rem)]">
        <div className="px-8 py-12 w-full flex-1 bg-white rounded-t-[40px] backdrop-opacity-70 flex flex-col gap-12 items-center">
          <div className="w-full flex flex-col gap-4 items-start">
            <span className="px-8 flex gap-4 items-center text-[1.8rem] text-[#0f0f0f] font-semibold">
              <MagicTwoStarIcon width={1.6} height={1.6} color="#6000FF" />
              생성된 특약
            </span>
            <DivBox
             className="flex items-center px-7 py-6"
             style={{ backgroundColor: "rgb(242, 238, 251)",
                      border: "1px solid #6000FF",
                }}
              >
              안전임차인은 벽면에 못을 사용하여 생활용품을 설치할 수 있으며,
              퇴거 시 직경 5mm 이하 못구멍에 대한 원상복구비는 청구하지 않음
            </DivBox>
          </div>
          <div className="w-full flex flex-col gap-4 items-start">
            <span className="px-8 flex gap-4 items-center text-[1.8rem] text-[#0f0f0f] font-semibold">
              <QuestionMarkIcon color="#6000FF" />
              이유
            </span>
            <DivBox className="flex items-center px-7 py-6">
              전세사기 예방을 위해 임대인의 재정상태와 주택 권리관계를 
              투명하게 공개받아 안전한 거래 보장
            </DivBox>
          </div>
          <div className="w-full flex flex-col gap-4 items-start">
            <span className="px-8 flex gap-4 items-center text-[1.8rem] text-[#0f0f0f] font-semibold">
              <BulbIcon color="#6000FF" />
              협상 방안
            </span>
            <DivBox className="flex items-center px-7 py-6">
              안전임차인은 벽면에 못을 사용하여 생활용품을 설치할 수 있으며,
              민간임대주택에 관한 특별법 제48조에 따른 설명의무를 근거로
              상세한 정보 공개 요구
            </DivBox>            
          </div>
          <div className="flex gap-10 w-full">
            <button className="flex-1 flex flex-col items-center gap-4 py-6 rounded-[20px] border border-[#E5E5EA]"
            onClick={() => setLawModalOpen(true)}
            type="button"
            >
              <Image src="/scales.svg" width={30} height={24} alt="" />
              <span className="text-[1.5rem] font-semibold">
                관련 법률
              </span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-4 py-6 rounded-[20px] border border-[#E5E5EA]">
              <Image src="/openBook.svg" width={30} height={24} alt="" />
              <span className="text-[1.5rem] font-semibold">
                유사 판례
              </span>
            </button>
          </div>
          <button className="flex-1 flex items-center justify-center px-20 py-5 rounded-[20px] text-[#6000ff] !text-[1.8rem] border border-[#6000ff]">
            <DocumentIcon />&nbsp;                
              완성된 계약서 보기
          </button>
          <div className="flex items-center w-full mt-6">    
            <div className="w-[40rem]">
            {liArray && liArray[activeIndex]}
          </div>
        </div>
        </div>      
      </main>
    <Modal
        isOpen={lawModalOpen}
        setIsOpen={setLawModalOpen}
        clickOutsideClose={true}
    >
        <div className="mx-auto mt-6 mb-4 w-20 h-1.5 rounded-full bg-gray-300" />
        <div className="flex flex-col items-center py-2 px-10 w-full">
          <span className="px-8 flex gap-2 items-center text-[2rem] font-medium text-center mb-8">
            <ScalesIcon width={2} height={2} color="#6000FF" />
            관련 법률
          </span>
          <div className="w-full max-h-[47rem] overflow-y-auto">
          <ul className="w-full flex flex-col gap-4">
            {laws.map((law, idx) => (
              <li
                key={idx}
                className="bg-white rounded-[20px] border border-[#ededed] transition-all"
              >
                <button
                  type="button"
                  className="flex justify-between items-center w-full px-6 py-5 !text-[1.4rem] font-medium focus:outline-none"
                  onClick={() => toggleLaw(idx)}
                >
                  <span className="text-left text-[#222]">{law.title}</span>
                  <Image
                    src="/add.svg"
                    alt="펼치기"
                    width={24}
                    height={24}
                    className={`w-6 h-6 transition-transform duration-200 ${openedLaw.includes(idx) ? "rotate-90" : ""}`}
                  />
                </button>
                  {/* 펼쳐졌을 때만 내용 표시 */}
                  {openedLaw.includes(idx) && (
                    <div className="px-6 py-4 bg-[#fafafd] rounded-b-[20px] text-[1.2rem] text-gray-700 border-t border-[#ededed] animate-fadein">
                      {/* 여기에 law.content 혹은 상세 내용 */}
                      상세 법률 내용이 여기에 나와요!
                    </div>
                  )}
              </li>
            ))}
          </ul>
          </div>
        </div>
    </Modal>
    </>
  );
}

export default ContractCreateNewPage;
