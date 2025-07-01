"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useRef, useState } from "react";
import BackHeader from "@/components/BackHeader";
import Modal from "@/components/Modal";
import CheckedIcon from "@/components/icons/Checked";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import CrossIcon from "@/components/icons/Cross";
import { useCreateStore } from "@/store/useStore";
import clientApi from "@/lib/axios.client";
import LoadingPage from "./Loading";
import Image from "next/image";

function ContractCreateNewPage() {
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>("");
  const [userQuery, setUserQuery] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [contractTitle, setContractTitle] = useState("");

  const contractData = useCreateStore.getState();
  useEffect(() => {
    if (!contractData.contractType) {
      router.replace("/create");
    } else if (!contractData.articleAgree) {
      router.replace("step2");
    }
    // const stored = contractData.userQuery;
    const { contractTitle, userQuery: stored } = contractData;
    setContractTitle(contractTitle as string);
    if (stored && userQuery.length === 0) {
      try {
        setUserQuery(stored);
      } catch (err) {
        console.error("Failed to parse contractData:", err);
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contractData) return;
    useCreateStore.setState({ userQuery, basicAgreements });

    try {
      const { userQuery, contractType, property, payment, dates } =
        useCreateStore.getState();

      // 안전하게 null 체크 후 변수에 할당
      const propertyAddress = property?.address ?? null;
      const deposit = payment?.deposit ?? null;
      const monthlyRent = payment?.monthlyRent ?? null;
      const contractPeriodStart = dates?.contractDate ?? null;
      const contractPeriodEnd = dates?.contractDate ?? null;
      setUserQuery([]);

      alert("제출되었습니다. 잠시 기다려 주세요.");
      setModalOpen(true);
      setisLoading(true);

      const response = await clientApi.post("/create/generate", {
        contractData: useCreateStore.getState(),
        aggrementRequest: {
          contractType,
          propertyAddress,
          deposit,
          monthlyRent,
          contractPeriodStart,
          contractPeriodEnd,
          userQuery,
        },
      });

      if (response && response.status === 200) {
        useCreateStore.setState({
          contractId: response.data.id,
          legalBasis: response.data.legalBasis,
          caseBasis: response.data.caseBasis,
          agreements: response.data.agreements,
        });
        router.push("result");
        setisLoading(false);
      } else {
        alert("응답이 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Generate error:", error);
    } finally {
      setModalOpen(false);
      setisLoading(false);
    }
  };

  useEffect(() => {
    useCreateStore.setState({ userQuery });
  }, [userQuery]);

  useEffect(() => {
    if (modalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalOpen, userQuery]);

  const basicAgreements = [
    {
      reason: "특약 1 (중개수수료 분담)",
      suggestedRevision: "임대인과 임차인은 중개수수료를 50%씩 부담한다.",
    },
    {
      reason: "특약 2 (임대료 인상 제한)",
      suggestedRevision:
        "임대인의 동의 없이 임대료를 일방적으로 인상할 수 없으며, 계약 갱신 시 임대료 인상률은 5% 이내로 제한한다.",
    },
    {
      reason: "특약 3 (보증금 반환)",
      suggestedRevision:
        "보증금은 임차인 퇴거 후 원상복구 확인 후 7일 이내에 은행이자를 가산하여 반환한다.",
    },
    {
      reason: "특약 4 (시설 수리비 부담)",
      suggestedRevision:
        "에어컨, 보일러, 온수기 등 기본 시설의 고장 및 수리비는 임대인이 부담한다.",
    },
    {
      reason: "특약 5 (입주 전 정비)",
      suggestedRevision:
        "입주 전 도배, 장판 교체 및 기본 청소는 임대인이 부담한다.",
    },
    {
      reason: "특약 6 (관리비 부담)",
      suggestedRevision:
        "관리비 중 공용전기료, 엘리베이터 유지비, 경비비는 별도 부담하며, 수도, 전기, 가스 요금은 임차인이 직접 납부한다.",
    },
    {
      reason: "특약 7 (계약 해지 통지)",
      suggestedRevision: "중도 해지 시 상대방에게 2개월 전 서면으로 통지한다.",
    },
    {
      reason: "특약 8 (원상복구 의무)",
      suggestedRevision:
        "임차인의 고의 또는 과실로 인한 손상을 제외한 자연적 손상은 원상복구 의무를 면제한다.",
    },
    {
      reason: "특약 9 (화재보험 가입)",
      suggestedRevision: "화재보험 가입 및 보험료는 임대인이 부담한다.",
    },
    {
      reason: "특약 10 (행정절차 협조)",
      suggestedRevision:
        "전입신고 및 확정일자 취득에 필요한 서류 제공 등 임대인이 적극 협조한다.",
    },
    {
      reason: "특약 11 (법령 준수)",
      suggestedRevision:
        "본 계약서에 명시되지 않은 사항은 주택임대차보호법 등 관련 법령에 따른다.",
    },
  ];

  const [basicAgreementModal, setBasicAgreementModal] = useState(false);
  // const [basicAgreement, setBasicAgreements] = useState<Term[]>([]);
  const [opened, setOpened] = useState<number[]>([]);

  // useEffect(() => {
  //   if (basicAgreementModal) {
  //     setOpened([]); // 모달 열릴 때마다 초기화
  //   }
  // }, [basicAgreementModal]);

  return (
    <>
      <div className="h-20 mt-15 w-full flex flex-col justify-center items-center" />
      {contractTitle && <BackHeader>{contractTitle + " 작성"}</BackHeader>}
      <main className="flex flex-col items-center mt-[3rem] gap-12 h-[calc(100%-11rem)]">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <span className="w-full text-[2.4rem] font-medium">
              말로만 한 약속은 없던 일이 돼요.
              <br />
              <span className="text-[rgba(96,0,255,0.7)] font-semibold text-[2.5rem]">
                특약
              </span>
              으로 확실하게&nbsp;
              <span className="text-[rgba(225,0,255,0.7)] font-semibold text-[2.5rem]">
                보장
              </span>
              받으세요.
            </span>
          </div>
          <span className="flex justify-self-end self-end text-[1rem] font-medium text-[rgba(128,128,128,0.55)]">
            특약: 기본 계약서에 없는 추가 약속
          </span>
        </div>
        <form
          onSubmit={handleGenerate}
          className="h-full flex flex-col items-center w-full gap-4 text-[1.6rem] font-semibold"
        >
          4. 특약 사항
          <div className=" px-10 py-12 w-full flex-1 bg-white rounded-t-[40px] backdrop-opacity-70 flex flex-col gap-12 items-center text-[1.8rem] font-semibold">
            <div className="w-full flex flex-col justify-center items-center gap-4">
              당신의 계약은 안전해야 하니까
              <SubmitButton
                type="button"
                width="100%"
                height={6}
                background="white"
                borderColor="#f3f4f6"
                fontSize={1.4}
                fontWeight={700}
                fontColor="black"
                gap={0.5}
                className="flex flex-col justify-center py-6 px-12 h-24"
                onClick={() => setBasicAgreementModal(true)}
              >
                기본 특약
                <span className="text-[1rem] font-normal opacity-60">
                  기본적으로 계약서에 들어가는 특약입니다.
                </span>
              </SubmitButton>
            </div>
            <ul className="w-full flex flex-col justify-center items-center gap-4">
              당신의 니즈를 잊지 않도록
              {userQuery.length
                ? userQuery.map((value, index) => (
                    <li
                      key={index}
                      className="w-full h-20 px-12 flex justify-between items-center text-[1.4rem] text-[#3a3a40] font-medium border border-[#d7d7d7] rounded-[50px] bg-white"
                    >
                      <div className="flex gap-4">
                        <span className="w-[1.6rem] h-[1.6rem] flex justify-center items-center bg-main text-white rounded-[50px] text-[1rem]">
                          {index + 1}
                        </span>
                        {value}
                      </div>
                      <div
                        onClick={() =>
                          setUserQuery(userQuery.filter((v, i) => i != index))
                        }
                      >
                        <CrossIcon />
                      </div>
                    </li>
                  ))
                : ""}
              <SubmitButton
                type="button"
                width="100%"
                height={6}
                background="white"
                borderColor="#5046E5"
                fontSize={1.4}
                fontWeight={700}
                fontColor="#5046E5"
                gap={0.5}
                className="flex flex-col justify-center items-start py-6 px-12"
                onClick={() => setModalOpen(true)}
              >
                + 추가하기
                <span className="text-[1rem] font-normal">
                  ex&#41; 고양이 키우고 싶어요, 주차 공간이 필요해요
                </span>
              </SubmitButton>
              {userQuery.length === 0 ? (
                <span className="text-[10px] font-normal bg-gradient-to-br from-[rgba(96,0,255,0.7)] to-[rgba(225,0,255,0.7)] bg-clip-text text-transparent">
                  위 버튼을 눌러 요구사항을 입력해 보세요!
                </span>
              ) : (
                ""
              )}
            </ul>
            <div className="flex-1" />
            <SubmitButton
              width={30}
              height={5.5}
              fontSize={1.7}
              fontWeight={500}
              disabled={userQuery.length === 0}
              className="flex w-full justify-center items-center mb-8 mt-auto"
              icon={<MagicTwoStarIcon color="white" />}
            >
              생성하기
            </SubmitButton>
          </div>
        </form>
      </main>
      <Modal
        isOpen={basicAgreementModal}
        setIsOpen={setBasicAgreementModal}
        clickOutsideClose={true}
      >
        <div className="mx-auto mt-6 mb-4 w-20 h-1.5 rounded-full bg-gray-300" />
        <div className="flex flex-col items-center py-2 px-10 w-full">
          <span className="text-[2rem] font-medium text-center mb-8">
            기본 특약 사항
          </span>
          <div className="w-full max-h-[55rem] overflow-y-auto">
            <ul className="w-full flex flex-col gap-4">
              {basicAgreements.map((term, idx) => (
                <li
                  key={idx}
                  className="bg-white rounded-[20px] border border-[#ededed] mb-2 transition-all"
                >
                  <button
                    type="button"
                    className="flex justify-between items-center w-full px-5 py-5 !text-[1.2rem] font-medium focus:outline-none"
                    onClick={() =>
                      setOpened((prev) =>
                        prev.includes(idx)
                          ? prev.filter((i) => i !== idx)
                          : [...prev, idx]
                      )
                    }
                  >
                    <span className="text-left text-[#444]">{term.reason}</span>
                    <Image
                      src="/add.svg"
                      alt="펼치기"
                      width={24}
                      height={24}
                      className={`w-6 h-6 transition-transform duration-200 ${
                        opened.includes(idx) ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {/* 펼쳐졌을 때만 내용 표시 */}
                  {opened.includes(idx) && (
                    <div className="px-6 py-6 bg-[#fafafd] rounded-b-[20px] text-[1.2rem] text-gray-700 border-t border-[#ededed] animate-fadein">
                      {term.suggestedRevision}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        clickOutsideClose={true}
        isCenter={isLoading}
        upperChildren={
          !isLoading && (
            <ul
              className={`absolute bottom-[29rem] w-full flex flex-col justify-center items-center gap-4`}
            >
              {userQuery.length
                ? userQuery.map((value, index) => (
                    <li
                      key={index}
                      className="w-[calc(100%-5rem)] h-20 px-12 flex justify-between items-center text-[1.4rem] text-[#3a3a40] font-medium border border-[#d7d7d7] rounded-[50px] bg-white"
                    >
                      <div className="flex gap-4">
                        <span className="w-[1.6rem] h-[1.6rem] flex justify-center items-center bg-main text-white rounded-[50px] text-[1rem]">
                          {index + 1}
                        </span>
                        {value}
                      </div>
                      <div
                        onClick={() =>
                          setUserQuery(userQuery.filter((v, i) => i != index))
                        }
                      >
                        <CrossIcon />
                      </div>
                    </li>
                  ))
                : ""}
            </ul>
          )
        }
      >
        {!isLoading ? (
          <>
            <div className="mt-16 mb-4 px-8 w-full flex flex-col gap-4">
              <div className="flex flex-col items-center gap-4 mb-8">
                <span className="text-[2rem] font-bold text-center">
                  당신의 요구사항을 입력하세요
                </span>
                <span className="text-main text-[1.2rem] font-semibold">
                  특약 추가하기
                </span>
              </div>
              <div className="w-full h-20 bg-white border border-[#d7d7d7] rounded-[50px]">
                <input
                  type="text"
                  name=""
                  id=""
                  ref={inputRef}
                  placeholder="ex) 고양이 키우고 싶어오, 주차 공간이 필요해요"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                  className="w-full h-full px-12 text-[1.2rem] font-medium placeholder:text-subText"
                />
              </div>
              <button
                className={`flex items-center justify-center gap-4 text-[1.4rem] font-medium${
                  userQuery.length === 0
                    ? " text-[rgba(128,128,128,0.55)] cursor-not-allowed pointer-events-none"
                    : " text-main"
                }`}
                onClick={() => setModalOpen(false)}
              >
                <CheckedIcon
                  width={1.6}
                  height={1.6}
                  color={
                    userQuery.length === 0
                      ? "rgba(128,128,128,0.55)"
                      : "#6000ff"
                  }
                />
                완료
              </button>
            </div>
            <SubmitButton
              className="justify-self-end"
              type="button"
              width="100%"
              height={6}
              fontSize={1.8}
              fontWeight={500}
              disabled={inputValue === ""}
              borderRadius="none"
              onClick={() => {
                setUserQuery([...userQuery, inputValue]);
                setInputValue("");
              }}
            >
              + 추가하기
            </SubmitButton>
          </>
        ) : (
          <div className="fixed top-0 left-0 z-50 flex justify-center items-center w-full h-full bg-white">
            <LoadingPage />
          </div>
        )}
      </Modal>
    </>
  );
}
export default ContractCreateNewPage;
