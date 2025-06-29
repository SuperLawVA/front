"use client";

import SubmitButton from "@/components/SubmitButton";
import { use, useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import ClockIcon from "@/components/icons/Clock";
import InfoIcon from "@/components/icons/Info";
import MapIcon from "@/components/icons/Map";
import CalendarIcon from "@/components/icons/Calendar";
import PaymentIcon from "@/components/icons/Payment";
import AssetIcon from "@/components/icons/Asset";
import Image from "next/image";
import clientApi from "@/lib/axios.client";
import Contract from "@/app/types/Contract";
import { useRouter } from "next/navigation";
import axios from "axios";

export function StartPage(props: { params: Promise<{ contractId: string }> }) {
  const router = useRouter();
  const { contractId } = use(props.params);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [contract, setContract] = useState<Contract | null>(null);
  const tabs = ["계약 요약", "계약서 정보", "계약 조건", "특약"];

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

  const tabContents = [
    <div
      key="0"
      className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-bold text-[1.6rem]"
    >
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 items-center">
          <ClockIcon />
          계약기간
        </span>
        <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
          {contract?.createdDate.split("T")[0] ?? "미기재"}
          {" - "}
          {contract?.createdDate.split("T")[0] ?? "미기재"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 items-center">
          <AssetIcon />
          보증금
        </span>
        <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
          {contract?.payment.deposit ?? 0}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 items-center">
          <PaymentIcon />
          월세
        </span>
        <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
          {contract?.payment.monthlyRent ?? 0}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 items-center">
          <CalendarIcon />
          납부일
        </span>
        <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
          {contract?.payment.monthlyRentDate.length === 0
            ? "미기재"
            : contract?.payment.monthlyRentDate}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 items-center">
          <MapIcon />
          주소
        </span>
        <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
          {contract?.property.address.length === 0
            ? "미기재"
            : contract?.property.address}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex gap-2 items-center">
          <InfoIcon width={1.4} height={1.4} color="#6000FF" />
          상세 주소
        </span>
        <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
          {contract?.property.detailAddress.length === 0
            ? "미기재"
            : contract?.property.detailAddress}
        </span>
      </div>
    </div>,
    <div key="1" className="flex flex-col w-full gap-12">
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-bold pl-8">1. 부동산 표시</span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-bold text-[1.6rem]">
          <div className="flex flex-col gap-2">
            주소
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.address.length === 0
                ? "미기재"
                : contract?.property.address}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            상세 주소
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.detailAddress.length === 0
                ? "미기재"
                : contract?.property.detailAddress}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            면적
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.building.buildingArea.length === 0
                ? "미기재"
                : contract?.property.building.buildingArea}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            구조
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.building.buildingConstructure.length === 0
                ? "미기재"
                : contract?.property.building.buildingConstructure}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            용도
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property.building.buildingConstructure.length === 0
                ? "미기재"
                : contract?.property.building.buildingConstructure}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-bold pl-8">2. 계약 내용</span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-bold text-[1.6rem]">
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
            계약일자
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.createdDate.split("T")[0] ?? "미기재"}
              {" - "}
              {contract?.createdDate.split("T")[0] ?? "미기재"}
            </span>
          </div>
        </div>
      </div>
    </div>,
    <div key="2" className="flex flex-col w-full gap-4">
      <span className="text-[1.6rem] font-bold pl-8">계약 조항</span>
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
                return <li key={i}>{v.suggested_revision}</li>;
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
                return <li key={i}>{v.suggested_revision}</li>;
              })}
            </ol>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {/* <span className="text-[1.6rem] font-bold pl-8">1. 기본 특약</span> */}
          <span className="text-[1.6rem] font-bold pl-8">특약 사항</span>
          <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
            {contract?.agreements.map((v, i) => {
              return <li key={i}>{v.suggested_revision}</li>;
            })}
          </ol>
        </div>
      )}
    </div>,
  ];

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      {contract?.contractTitle && (
        <BackHeader to="/">{contract.contractTitle}</BackHeader>
      )}

      <main className="flex flex-col items-center mt-[3rem] gap-12 mx-10  h-auto">
        <ul className="flex justify-around items-center w-full h-16 font-medium text-subText text-[1.2rem] bg-white border border-[#cdcdcd] rounded-[50px]">
          {tabs.map((tab, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-1 flex h-full items-center justify-center rounded-[50px]${
                activeIndex === index ? " bg-main text-white" : ""
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
        {tabContents[activeIndex]}
        <SubmitButton
          width={10}
          height={3}
          fontSize={1}
          fontWeight={500}
          fontColor="#6000FF"
          borderRadius={"50px"}
          background="#ffffff"
          borderColor="#6000FF"
        >
          원본 보기
        </SubmitButton>
        <div className="w-full h-[4.5rem] gap-2 flex justify-center items-center text-white text-[1.6rem] font-semibold bg-gradient-to-br from-[#6000FF] via-[#8a00ff] to-[#E100FF] rounded-[50px] mb-12">
          <Image
            width={9999}
            height={9999}
            src="/bot.png"
            alt=""
            className="w-12 h-12"
          />
          궁금한 점이 있으면 챗봇을 이용해 보세요!
        </div>
      </main>
    </>
  );
}

export default StartPage;
