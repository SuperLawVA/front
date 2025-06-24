// page.tsx
"use client";

import DocumentIcon from "@/components/icons/Document";
import InfoIcon from "@/components/icons/Info";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import Modal from "@/components/Modal";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnalysisTarget } from "../types/Main";
import axios from "axios";
import { useCertificateStore } from "@/store/useStore";

function StartPage() {
  const router = useRouter();
  const [contractArray, setContractArray] = useState<
    AnalysisTarget[] | undefined | null
  >(undefined);
  const [contract, setContract] = useState<AnalysisTarget | undefined | null>(
    undefined
  );
  const [modalOpen, setModalOpen] = useState(false);

  // 진입 시 계약서 정보
  const getContract = async () => {
    try {
      const response = await axios.post("/api/analysis");
      setContractArray(response.data.contract as AnalysisTarget[]);
      // return response.data.contract as AnalysisTarget[];
      // return JSON.parse(response.data.contract) as AnalysisTarget[];
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getContract();

      // const target = undefined;
      if (contractArray) {
        setContract(contractArray[0]);
      } else {
        setContract(undefined);
        setModalOpen(true);
      }
      console.log(contractArray);
    };
    fetchData();
  }, [contractArray]);

  return (
    <>
      <main className="flex flex-col items-center h-full bg-white">
        <div className="h-52 w-full" />
        <SubmitButton
          width={17}
          height={3.2}
          background="rgba(255, 69, 58, 0.2)"
          fontSize={1.2}
          fontWeight={700}
          icon={<InfoIcon color="red" width={1.2} height={1.2} />}
        >
          <span className="text-red-500">AI로 내용증명서 생성하기</span>
        </SubmitButton>
        <div className="mt-8 text-center text-[2.6rem]/[3.1rem] font-bold">
          상황에 맞는 <span className="text-good">내용증명서</span>를
          <br />
          자동으로 생성하세요
        </div>
        <Image
          src="/ai_document.png"
          alt="vector Icon"
          width={250}
          height={250}
          className="mt-16"
        />
        <div className="text-[#9ca3af] mt-16 text-center text-[1.3rem] font-bold">
          AI가 귀하의 상황을 분석하여 법적 효력이 있는
          <br />
          내용증명서를 자동 작성합니다.
        </div>
        <SubmitButton
          width={26}
          height={5.5}
          fontSize={1.8}
          className="mt-16 flex items-center justify-center gap-x-2 whitespace-nowarp"
          onClick={() => setModalOpen(true)}
          icon={<MagicTwoStarIcon width={2.4} height={2.4} color="#FFFFFF" />}
        >
          생성하기
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
        {contract ? (
          <div className="w-full p-16 flex flex-col gap-12">
            <div className="text-[2rem] font-bold text-center">
              업로드하는 파일이 맞으신가요?
            </div>
            <div className="flex flex-col gap-8 p-8 justify-center items-center w-full border-[1.5px] border-[#c6c6c8] rounded-[20px]">
              <DocumentIcon color="#6000ff" />
              <span className="text-[1.6rem] font-medium">
                {contract?.title}
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
                  useCertificateStore.setState({ ContractId: contract._id });
                  router.push("certificate/step1");
                }}
              >
                네, 맞아요
              </SubmitButton>
            </div>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-1/2 p-12 w-[90%] bg-white rounded-[50px]">
            <div className="w-full gap-12 flex flex-col justify-center items-center bg-white rounded-[50px]">
              업로드 된 계약서가 없습니다. 계약서 업로드로 이동합니다.
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
<<<<<<< HEAD
          <div className="flex font-bold px-8">
            <span className="flex-1 text-[1.6rem] text-[#2b2b2b]">
              계약 유형
            </span>
            <span className="flex-1 text-[1.4rem] text-[#5c5c5c]">
              부동산(전세) 계약서
            </span>
          </div>
          <div className="flex font-bold px-8">
            <span className="flex-1 text-[1.6rem] text-[#2b2b2b]">
              계약 일자
            </span>
            <span className="flex-1 text-[1.4rem] text-[#5c5c5c]">
              2018.08.28.
            </span>
          </div>
          <div className="flex font-bold px-8">
            <span className="flex-1 text-[1.6rem] text-[#2b2b2b]">
              건물 유형
            </span>
            <span className="flex-1 text-[1.4rem] text-[#5c5c5c]">
              오피스텔
            </span>
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
                setModalOpen(false);
                router.push("/main/certificate");
              }}
            >
              다시 업로드
            </SubmitButton>
            <SubmitButton
              width={16}
              height={5}
              fontSize={1.6}
              fontWeight={500}
              onClick={() => {
                setModalOpen(false);
                router.push("certificate/step1");
              }}
            >
              네, 맞아요
            </SubmitButton>
          </div>
        </div>
=======
        )}
>>>>>>> d5377f8555f1f72f3baf2791a77d0fea769311d2
      </Modal>
    </>
  );
}

export default StartPage;
