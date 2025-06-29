// page.tsx
"use client";

import DocumentIcon from "@/components/icons/Document";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import Modal from "@/components/Modal";
import StyledDiv from "@/components/StyledDiv";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnalysisTarget } from "../types/Main";
import Image from "next/image";
import { useAuthStore } from "@/store/useStore";
import clientApi from "@/lib/axios.client";

function AnalysisPage() {
  const router = useRouter();
  const [contractArray, setContractArray] = useState<
    AnalysisTarget[] | undefined | null
  >(undefined);
  const [contract, setContract] = useState<AnalysisTarget | undefined | null>(
    undefined
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function formatISOToDateTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString("sv-SE", { timeZone: "UTC" }).replace("T", " ");
  }

  useEffect(() => {
    const fetchData = async () => {
      const { contractArray } = useAuthStore.getState();
      if (contractArray) {
        contractArray.sort((a, b) => {
          return (
            new Date(b.modifiedDate).getTime() -
            new Date(a.modifiedDate).getTime()
          );
        });
        setContractArray(contractArray);
        setContract(contractArray[activeIndex]);
      } else {
        setContract(undefined);
        setModalOpen(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (contractArray?.length && activeIndex !== 0) {
      const activeItem = contractArray[activeIndex];
      const newArray = [
        activeItem,
        ...contractArray.slice(0, activeIndex),
        ...contractArray.slice(activeIndex + 1),
      ];
      setContractArray(newArray);
      setActiveIndex(0);
    }
    if (!modalOpen) setSelect(false);
  }, [activeIndex]);

  // 분석 요청 정보
  const analysisRequest = async (contractId: string) => {
    try {
      const response = await clientApi.post("/analysis/generate", {
        contractId,
      });
      console.log("analysis response");
      console.log(response);

      // router.push("analysis/result");
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      return undefined;
    }
  };

  return (
    <>
      <main className="flex flex-col items-center h-full bg-white">
        <div className="h-52 w-full" />
        <StyledDiv
          width="auto"
          height={3.5}
          background="rgba(10, 132, 255, 0.2)"
          fontSize={1.2}
          fontColor="#0A84FF"
          fontWeight={700}
          borderColor="none"
          className="px-10 flex justify-center items-center"
          icon={<MagicTwoStarIcon width={1.4} height={1.4} color="#0A84FF" />}
        >
          AI로 계약서 분석하기
        </StyledDiv>
        <div className="mt-8 text-center text-[2.6rem]/[3.1rem] font-bold">
          AI 분석으로
          <br />
          분쟁을 미리 예방하세요
        </div>
        <Image
          width={99999}
          height={99999}
          src="/analysisStart.png"
          alt="Main Icon"
          className="w-[26.5rem] h-[26.5rem] mt-16"
        />
        <div className="mt-16 text-center text-[1.2rem] font-medium">
          법령 10만 건, 판례 9만 건 기반 AI가
          <br />
          당신의 계약서 위험 사항을 감지해드리겠습니다.
        </div>
        <SubmitButton
          width={26}
          height={5.5}
          fontSize={1.8}
          className="mt-16"
          onClick={() => setModalOpen(true)}
        >
          시작하기
        </SubmitButton>
        <div
          onClick={() => router.back()}
          className="mt-8 text-[#797979] text-[1.4rem] font-medium"
        >
          ← 다음에 할래요
        </div>
      </main>
      <Modal
        isOpen={modalOpen}
        isCenter={!Boolean(contract)}
        setIsOpen={setModalOpen}
        clickOutsideClose={true}
      >
        {contract && !select && (
          <div className="w-full p-16 flex flex-col gap-12">
            <div className="text-[2rem] font-bold text-center">
              분석할 계약서를 확인해주세요
            </div>
            <div
              onClick={() => {
                setSelect(true);
              }}
              className="flex flex-col gap-8 p-8 justify-center items-center w-full border-[1.5px] border-[#c6c6c8] rounded-[20px]"
            >
              <DocumentIcon color="#6000ff" />
              <span className="text-[1.6rem] font-medium">
                {contract.contractType}&nbsp;임대차 계약서
              </span>
            </div>
            <ul className="w-full px-8 flex flex-col gap-12 items-center text-[#2b2b2b] text-[1.6rem] font-bold">
              {[
                ["계약 유형", contract?.contractType],
                ["계약 일자", contract?.contractDate],
                ["건물 유형", contract?.buildingType],
              ].map(([value, detail], index) => (
                <li
                  key={index}
                  className="w-full flex justify-between items-center"
                >
                  <span className="flex-1">{value?.toString()}</span>
                  <span className="flex-1 text-[1.4rem] text-[#5c5c5c]">
                    {typeof detail === "string" ? detail.split("T")[0] : "미정"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex w-full gap-8">
              <SubmitButton
                type="button"
                height={5}
                fontSize={1.6}
                fontWeight={500}
                fontColor="#1e1e1e"
                background="white"
                borderColor="#5c5c5c"
                onClick={() => router.push("upload")}
              >
                다시 업로드
              </SubmitButton>
              <SubmitButton
                height={5}
                fontSize={1.6}
                fontWeight={500}
                onClick={() => {
                  analysisRequest(contract._id);
                }}
              >
                네, 맞아요
              </SubmitButton>
            </div>
          </div>
        )}
        {contract && select && (
          <div className="w-full p-16 flex flex-col gap-12">
            <div className="text-[2rem] font-bold text-center">
              분석할 계약서를 선택해주세요
            </div>
            <ul className="w-full px-8 flex flex-col gap-12 items-center text-[#2b2b2b] text-[1.6rem] font-bold max-h-[50vh] overflow-y-auto">
              {contractArray?.map((contract, index) => (
                <SubmitButton
                  key={index}
                  className="flex flex-col justify-center items-start py-2 px-10"
                  gap={0}
                  height={"auto"}
                  background="#eeeeee"
                  borderColor="black"
                  fontSize={1.2}
                  fontColor={`${activeIndex === index ? "#6000ff" : "black"}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setSelect(false);
                  }}
                >
                  <span className="font-bold">
                    계약 유형:&nbsp;
                    <span className="">{contract?.contractType}</span>
                  </span>
                  <span className="text-[1.2rem]">
                    최종 수정 일자:{" "}
                    {formatISOToDateTime(contract?.modifiedDate as string)}
                  </span>
                  <span className="text-[1.2rem]">
                    건물 유형: {contract?.buildingType ?? "미기재"}
                  </span>
                </SubmitButton>
              ))}
            </ul>
          </div>
        )}
        {!contract && (
          <div className="flex self-center justify-self-center p-12 w-[90%] bg-white rounded-[50px]">
            <div className="w-full gap-12 flex flex-col justify-center items-center text-center text-[1.8rem] font-semibold bg-white rounded-[50px]">
              업로드 된 계약서가 없습니다.
              <br />
              계약서 업로드로 이동합니다.
              <SubmitButton
                type="button"
                height={5}
                fontSize={1.6}
                fontWeight={500}
                // fontColor="#1e1e1e"
                // background="white"
                // borderColor="#5c5c5c"
                onClick={() => router.replace("upload")}
              >
                계약서 업로드로 이동
              </SubmitButton>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default AnalysisPage;
