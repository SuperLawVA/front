"use client";

import DocumentIcon from "@/components/icons/Document";
import PencilIcon from "@/components/icons/Pencil";
import { use, useEffect, useState, useRef } from "react";
import BackHeader from "@/components/BackHeader";
import ClockIcon from "@/components/icons/Clock";
import InfoIcon from "@/components/icons/Info";
import MapIcon from "@/components/icons/Map";
import CalendarIcon from "@/components/icons/Calendar";
import PaymentIcon from "@/components/icons/Payment";
import AssetIcon from "@/components/icons/Asset";
import clientApi from "@/lib/axios.client";
import Modal from "@/components/Modal";
import Contract from "@/app/types/Contract";
import { useRouter } from "next/navigation";
import axios from "axios";
import StyledInput from "@/components/StyledInput";
import GreenLogoIcon from "@/components/icons/GreenLogo";

function StartPage(props: { params: Promise<{ contractId: string }> }) {
  const router = useRouter();
  const { contractId } = use(props.params);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [contract, setContract] = useState<Contract | null>(null);
  const tabs = ["계약 요약", "계약서 정보", "계약 조건", "특약"];

  const [openSend, setOpenSend] = useState(false);
  const [sendStep, setSendStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRef = useRef(null);
  const startY = useRef(0);
  const [dragY, setDragY] = useState(0);

  const getUserData = async () => {
    try {
      const response = await clientApi.post("/contract", { contractId });
      setContract(response.data.contract);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          alert("잘못된 접근입니다!");
          router.replace("/"); // 이전 페이지로 돌아감
          return;
        }
      }
    }
  };
  useEffect(() => {
    getUserData();
  }, [router]);

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
  const tabContents = [
    <div key="0" className="w-full h-full flex flex-col gap-4">
      <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
        <PencilIcon width={1.4} height={1.4} />
        수정하기
      </span>
      <div className="flex flex-col gap-10 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <ClockIcon width={1.5} height={1.5} />
            계약 일자
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.createdDate.split("T")[0] ?? "미기재"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <AssetIcon width={1.5} height={1.5} />
            보증금
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.payment.deposit ?? 0}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <PaymentIcon width={1.5} height={1.5} />
            월세
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.payment.monthlyRent ?? 0}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <CalendarIcon width={1.5} height={1.5} />
            납부일
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.payment.monthlyRentDate ?? "미기재"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <MapIcon width={1.5} height={1.5} />
            주소
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.property.address ?? "미기재"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <InfoIcon width={1.5} height={1.5} color="#6000FF" />
            상세 주소
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.property.detailAddress ?? "미기재"}
          </span>
        </div>
      </div>
    </div>,
    <div key="1" className="flex flex-col w-full gap-12">
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-semibold text-center">
          1. 부동산 표시
        </span>
        <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
          <PencilIcon width={1.4} height={1.4} />
          수정하기
        </span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
          <div className="flex flex-col gap-2">
            주소
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {typeof contract?.property.address === "string" &&
              contract?.property.address.length !== 0
                ? contract?.property.address
                : "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            상세 주소
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.detailAddress ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            면적
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.building.buildingArea ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            구조
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.building.buildingConstructure ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            용도
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.building.buildingConstructure ?? "미기재"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-semibold text-center">
          2. 계약 내용
        </span>
        <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
          <PencilIcon width={1.4} height={1.4} />
          수정하기
        </span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
          <div className="flex flex-col gap-2">
            보증금
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.payment.deposit ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            계약금
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.payment.downPayment ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            중도금
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.payment.intermediatePayment ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            월세
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.payment.monthlyRent ?? "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            계약 기간
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.dates.startDate
                ? contract?.dates.startDate.split("T")[0]
                : "미기재"}
              {" - "}
              {contract?.dates.endDate
                ? contract?.dates.endDate.split("T")[0]
                : "미기재"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-semibold text-center">
          3. 집주인 정보
        </span>
        <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
          <PencilIcon width={1.4} height={1.4} />
          수정하기
        </span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
          <div className="flex flex-col gap-2">
            성명
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.address.length === 0
                ? "미기재"
                : contract?.property.address}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            전화번호
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.detailAddress ?? "미기재"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-semibold text-center">
          4. 부동산 사무실 정보
        </span>
        <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
          <PencilIcon width={1.4} height={1.4} />
          수정하기
        </span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
          <div className="flex flex-col gap-2">
            사무실 이름
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.address.length === 0
                ? "미기재"
                : contract?.property.address}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            전화번호
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.detailAddress ?? "미기재"}
            </span>
          </div>
        </div>
      </div>
    </div>,
    <div key="2" className="flex flex-col w-full gap-4">
      <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
        <PencilIcon width={1.4} height={1.4} />
        수정하기
      </span>
      <ul className="flex flex-col gap-2 w-full rounded-[30px] p-12 bg-white font-bold text-[1.2rem]">
        {contract?.articles.map((v, i) => {
          return (
            <li key={i}>
              {v.split("\n")[0]}
              <br />
              &nbsp;&nbsp;
              <span className="font-normal">{v.split("\n")[1]}</span>
            </li>
          );
        })}
      </ul>
    </div>,
    <div key="3" className="flex flex-col w-full gap-12">
      {contract?.generated ? (
        <>
          <div className="flex flex-col gap-4">
            {/* <span className="text-[1.6rem] font-bold pl-8">1. 기본 특약</span> */}
            <span className="text-[1.6rem] font-bold pl-8">기본 특약 사항</span>
            <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
              {contract?.basicAgreements.map((v, i) => {
                return <li key={i}>{v.suggestedRevision}</li>;
              })}
            </ol>
          </div>
          <div className="flex flex-col gap-4">
            {/* <span className="text-[1.6rem] font-bold pl-8">1. 기본 특약</span> */}
            <span className="text-[1.6rem] font-bold pl-8">
              생성된 특약 사항
            </span>
            <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
              {contract?.agreements.map((v, i) => {
                return <li key={i}>{v.suggestedRevision}</li>;
              })}
            </ol>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {/* <span className="text-[1.6rem] font-bold pl-8">1. 기본 특약</span> */}
          <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
            <PencilIcon width={1.4} height={1.4} />
            수정하기
          </span>
          <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
            {contract?.agreements.map((v, i) => {
              return <li key={i}>{v.suggestedRevision}</li>;
            })}
          </ol>
        </div>
      )}
    </div>,
  ];

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <div className="mt-10">
        {contract?.contractTitle && (
          <BackHeader to="/">{contract.contractTitle}</BackHeader>
        )}
      </div>
      <main className="flex flex-col items-center mt-[3rem] gap-12 mx-10 h-auto">
        <ul className="flex items-center w-full h-16 font-medium text-subText text-[1.2rem] bg-white border border-[#cdcdcd] rounded-[50px]">
          {tabs.map((tab, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-1 flex h-full items-center justify-center rounded-[50px] transition-all duration-100 ${
                activeIndex === index ? " bg-main text-white" : ""
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
        {tabContents[activeIndex]}
        <button
          className="flex-1 mb-30 flex items-center justify-center px-15 py-5.5 rounded-[20px] text-[#6000ff] !text-[1.4rem] border border-[#6000ff] bg-white"
          onClick={() => {
            setEmail("");
            setOpenSend(true);
            setSendStep(1);
          }}
        >
          <DocumentIcon />
          {`  계약서 ${contract?.generated ? "초안 " : ""}이메일로 전송하기`}
          {/* &nbsp; 계약서 초안 이메일로 전송하기 */}
        </button>
      </main>
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
                계약서 초안을 전송해 드릴게요
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
                  onClick={() => setSendStep(2)}
                >
                  다음
                </button>
              </div>
            </>
          )}
          {/* STEP 2: 전송 완료 안내 */}
          {sendStep === 2 && (
            <>
              <div className="flex items-center px-6 py-5 justify-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-[1.9rem] font-bold mt-8">
                    계약서 초안 발송이 완료되었습니다
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-center mb-14">
                <GreenLogoIcon width={5} height={5} />
              </div>
              <div className="grid grid-cols-2 gap-8 px-6 pb-8 text-[1.6rem]">
                <button
                  className="w-[160px] h-[50px] border border-gray-600 rounded-[40px] -ml-4"
                  onClick={() => {
                    setSendStep(1);
                    setEmail("");
                  }}
                >
                  다시 전송하기
                </button>
                <button
                  className="w-[160px] h-[50px] border-none bg-[#6000FF] rounded-[40px] text-white"
                  onClick={() => {
                    setOpenSend(false);
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

export default StartPage;
