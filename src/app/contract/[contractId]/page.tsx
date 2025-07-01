"use client";

import PencilIcon from "@/components/icons/Pencil";
import { use, useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import ClockIcon from "@/components/icons/Clock";
import InfoIcon from "@/components/icons/Info";
import MapIcon from "@/components/icons/Map";
import CalendarIcon from "@/components/icons/Calendar";
import PaymentIcon from "@/components/icons/Payment";
import AssetIcon from "@/components/icons/Asset";
import clientApi from "@/lib/axios.client";
import Contract from "@/app/types/Contract";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCreateStore } from "@/store/useStore";

function StartPage(props: { params: Promise<{ contractId: string }> }) {
  const router = useRouter();
  const { contractId } = use(props.params);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [contract, setContract] = useState<Contract | null>(null);
  const tabs = ["계약 요약", "계약서 정보", "계약 조건", "특약"];
  const getUserData = async () => {
    try {
      const response = await clientApi.post("/contract", { contractId });
      setContract(response.data.contract);

      const { contractTitle, legalBasis, agreements, caseBasis } =
        response.data.contract;

      useCreateStore.setState({
        contractTitle,
        legalBasis,
        agreements,
        contractId,
        caseBasis,
      });
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
    <div key="0" className="w-full h-full flex flex-col gap-4">
      {/* <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
        <PencilIcon width={1.4} height={1.4} />
        수정하기
      </span> */}
      <div className="flex flex-col gap-10 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <ClockIcon width={1.5} height={1.5} />
            계약 일자
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {!contract?.createdDate
              ? "미기재"
              : contract?.createdDate.split("T")[0]}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <AssetIcon width={1.5} height={1.5} />
            보증금
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {!contract?.payment.deposit ? 0 : contract?.payment.deposit}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <PaymentIcon width={1.5} height={1.5} />
            월세
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {!contract?.payment.monthlyRent ? 0 : contract?.payment.monthlyRent}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <CalendarIcon width={1.5} height={1.5} />
            납부일
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.payment.monthlyRentDate === null
              ? "미기재"
              : contract?.payment.monthlyRentDate === undefined
              ? "미기재"
              : contract?.payment.monthlyRentDate}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <MapIcon width={1.5} height={1.5} />
            주소
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.property.address === null
              ? "미기재"
              : contract?.property.address === undefined
              ? "미기재"
              : contract?.property.address}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <InfoIcon width={1.5} height={1.5} color="#6000FF" />
            상세 주소
          </span>
          <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
            {contract?.property.detailAddress === null
              ? "미기재"
              : contract?.property.detailAddress === undefined
              ? "미기재"
              : contract?.property.detailAddress}
          </span>
        </div>
      </div>
    </div>,
    <div key="1" className="flex flex-col w-full gap-12">
      <div className="flex flex-col gap-4">
        <span className="text-[1.6rem] font-semibold text-center">
          1. 부동산 표시
        </span>
        <div className="flex flex-col gap-12 w-full rounded-[30px] p-12 bg-white font-semibold text-[1.6rem]">
          <div className="flex flex-col gap-2">
            주소
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property?.address &&
              contract.property.address.length > 0
                ? contract.property.address
                : "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            상세 주소
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property?.detailAddress &&
              contract.property.detailAddress.length > 0
                ? contract.property.detailAddress
                : "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            면적
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {typeof contract?.property?.building?.buildingArea === "number" &&
              contract.property.building.buildingArea !== 0
                ? contract.property.building.buildingArea
                : "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            구조
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property?.building?.buildingConstructure &&
              contract.property.building.buildingConstructure.length > 0
                ? contract.property.building.buildingConstructure
                : "미기재"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            용도
            <span className="text-[#4e4e4e] text-[1.2rem] font-medium">
              {contract?.property?.building?.buildingType &&
              contract.property.building.buildingType.length > 0
                ? contract.property.building.buildingType
                : "미기재"}
            </span>
          </div>
        </div>
      </div>
    </div>,
    <div key="2" className="flex flex-col w-full gap-4">
      {/* <span className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8">
        <PencilIcon width={1.4} height={1.4} />
        수정하기
      </span> */}
      <ul className="flex flex-col gap-2 w-full rounded-[30px] p-12 bg-white font-bold text-[1.2rem]">
        {Array.isArray(contract?.articles) ? (
          contract.articles.map((v, i) => (
            <li key={i}>
              {v.split("\n")[0]}
              <br />
              &nbsp;&nbsp;
              <span className="font-normal">{v.split("\n")[1]}</span>
            </li>
          ))
        ) : (
          <li>미기재</li>
        )}
      </ul>
    </div>,
    <div key="3" className="flex flex-col w-full gap-12">
      {contract?.generated ? (
        <>
          <div className="flex flex-col gap-4">
            <span className="text-[1.6rem] font-bold pl-8">기본 특약 사항</span>
            <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
              {Array.isArray(contract?.basicAgreements) ? (
                contract.basicAgreements.map((v, i) => (
                  <li key={i}>{v.suggestedRevision}</li>
                ))
              ) : (
                <li>미기재</li>
              )}
            </ol>
          </div>
          <div className="flex flex-col gap-4">
            <span className="flex justify-between text-[1.6rem] font-bold pl-8">
              생성된 특약 사항
              <span
                onClick={() => router.push("/create/result")}
                className="flex text-[#6000ff] text-[1.1rem] font-semibold justify-end mr-8"
              >
                <PencilIcon width={1.4} height={1.4} />
                상세 보기
              </span>
            </span>
            <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
              {Array.isArray(contract?.agreements) ? (
                contract.agreements.map((v, i) => (
                  <li key={i}>{v.suggestedRevision}</li>
                ))
              ) : (
                <li>미기재</li>
              )}
            </ol>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <ol className="list-decimal list-inside flex flex-col gap-4 w-full rounded-[30px] p-8 bg-white font-medium text-[1.2rem]">
            {Array.isArray(contract?.agreements) ? (
              contract.agreements.map((v, i) => (
                <li key={i}>{v.suggestedRevision}</li>
              ))
            ) : (
              <li>미기재</li>
            )}
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
      </main>
    </>
  );
}

export default StartPage;
