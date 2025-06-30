"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import BackHeader from "@/components/BackHeader";
import InfoIcon from "@/components/icons/Info";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import DivBox from "@/components/DivBox";
import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlass";
import DocumentIcon from "@/components/icons/Document";
import Modal from "@/components/Modal";
import QuestionMarkIcon from "@/components/icons/QuestionMark";
import BookIcon from "@/components/icons/Book";
import ScalesIcon from "@/components/icons/Scales";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import clientApi from "@/lib/axios.client";
import axios from "axios";
import Article, { Agreement } from "@/app/types/Article";

export function AnalysisResultPage(props: {
  params: Promise<{ analysisId: string }>;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState(false);
  const [articleDetailArrayIndex, setArticleDetailArrayIndex] =
    useState<number>(0);
  const [agreementDetailArrayIndex, setAgreementDetailArrayIndex] =
    useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const { analysisId } = use(props.params);

  const getUserData = async () => {
    try {
      const response = await clientApi.post("/analysis", { analysisId });
      setArticles(response.data.articles as Article[]);
      setAgreements(response.data.agreements as Agreement[]);
      // setAgreements(
      //   Array.isArray(response.data.agreements) ? response.data.agreements : []
      // );

      // setContract(response.data.contract);
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

  const titleArray = ["계약 조항 분석 결과", "특약 사항 분석 결과"].map(
    (value, index) => (
      <li
        key={index}
        className="w-full h-20 px-10 py-6  flex items-center text-[1.8rem] text-[#3a3a40] font-semibold border border-[#d7d7d7] rounded-[50px] bg-white"
      >
        <div className="w-8 flex justify-center items-center flex-shrink-0">
          {!activeTitle ? (
            <ArrowLeftIcon
              color="white"
              className="cursor-not-allowed pointer-events-none"
            />
          ) : (
            <ArrowLeftIcon
              width={2}
              height={2}
              onClick={() => setActiveTitle(!activeTitle)}
              className="z-10 cursor-pointer"
            />
          )}
        </div>
        <div className="flex justify-center items-center gap-4 px-4 flex-grow overflow-hidden">
          <span className="flex-shrink-0">
            <MagnifyingGlassIcon />
          </span>
          <span className="truncate">{value}</span>
        </div>
        <div className="w-8 flex justify-center items-center flex-shrink-0">
          {activeTitle ? (
            <ArrowRightIcon
              color="white"
              className="cursor-not-allowed pointer-events-none"
            />
          ) : (
            <ArrowRightIcon
              width={2}
              height={2}
              onClick={() => setActiveTitle(!activeTitle)}
              className="z-10 cursor-pointer"
            />
          )}
        </div>
      </li>
    )
  );

  const articleArray = articles?.map(({ result, content }, index) => {
    return (
      <li
        key={index}
        className="w-full mx-8 py-6 px-8 flex items-center bg-white border border-[#f3f4f6] rounded-[20px]"
        onClick={
          result
            ? undefined
            : () => {
                const falseIndex = articleFalseArray.findIndex(
                  (i) => i === index
                );
                setArticleDetailArrayIndex(falseIndex);
                setModalOpen(true);
              }
        }
      >
        <span className="flex flex-1 gap-4 items-center overflow-hidden text-[1.4rem] font-medium">
          <span
            className={`flex-shrink-0 w-[1.4rem] h-[1.4rem] rounded-full bg-[#${
              result ? "32D74B" : "FF9500"
            }]`}
          />
          {content.split("\n")[0]}
        </span>

        {!result && <DocumentIcon width={1.6} height={1.6} color="black" />}
      </li>
    );
  });

  const agreementArray = agreements.map(({ content, result }, index) => {
    return (
      <li
        key={index}
        className="w-full mx-8 py-6 px-8 flex items-center bg-white border border-[#f3f4f6] rounded-[20px]"
        onClick={
          result
            ? undefined
            : () => {
                const falseIndex = agreementFalseArray.findIndex(
                  (i) => i === index
                );
                setAgreementDetailArrayIndex(falseIndex);
                setModalOpen(true);
              }
        }
      >
        <span className="flex flex-1 gap-4 items-center overflow-hidden text-[1.4rem] font-medium">
          <span
            className={`flex-shrink-0 w-[1.4rem] h-[1.4rem] rounded-full bg-[#${
              result ? "32D74B" : "FF9500"
            }]`}
          />
          <span className="truncate pr-4">{index + 1 + ". " + content}</span>
        </span>

        {!result && <DocumentIcon width={1.6} height={1.6} color="black" />}
      </li>
    );
  });

  const articleFalseArray = articles?.reduce<number[]>(
    (p, { result }, index) => (result ? p : [...p, index]),
    []
  );
  const agreementFalseArray = agreements.reduce<number[]>(
    (p, { result }, index) => (result ? p : [...p, index]),
    []
  );

  const articleDetailArray = articles?.map(
    (
      {
        result,
        content,
        reason,
        suggested_revision,
        negotiation_points,
        legal_basis,
        case_basis,
      },
      index
    ) => {
      return result ? (
        ""
      ) : (
        <div
          key={index}
          className={`inline-block w-[90%] h-full py-8 ${
            index === articleFalseArray[0]
              ? "ml-[6.5rem] mr-2"
              : index === articleFalseArray.at(-1)
              ? "ml-2 mr-[6.5rem]"
              : "mx-2"
          } rounded-[40px] snap-center align-top bg-white overflow-y-auto max-h-[80svh]
        `}
        >
          <div className="flex flex-col justify-center items-center px-8">
            <div className="w-full flex items-center text-[1.4rem] font-medium text-[#FF9500]">
              <span className="flex-shrink-0 w-[1.4rem] h-[1.4rem] rounded-full bg-[#FF9500]" />
              &nbsp;- 확인 필요 계약 조항
              {` (${articleFalseArray.findIndex((v) => v === index) + 1}/${
                articleFalseArray.length
              })`}
            </div>
            <hr className="w-[calc(100%+4rem)] my-4 -mx-4 border-0 border-t border-t-[#F3F4F6]" />
            <div className="w-full flex flex-col justify-center items-center gap-12">
              <div className="w-full flex flex-col justify-center items-center gap-4">
                <div className="w-full text-[1.6rem] text-start">
                  <span className="font-semibold">
                    {content.split("\n")[0].split("조")[0] + "조"}
                  </span>
                  {content.split("\n")[0].split("조")[1].trim()}
                </div>
                <div className="w-full flex gap-4 text-[1.2rem] text-black/70 border border-[#F3F4F6] rounded-[20px]">
                  <span className="px-10 flex items-center border border-[#F3F4F6] rounded-[20px] text-[1.2rem] font-semibold">
                    원본
                  </span>
                  <span className="my-6 text-wrap pr-4">
                    {content.split("\n")[1]}
                  </span>
                </div>
                <div className="w-full flex gap-4 bg-main/5 text-[1.2rem] border border-main rounded-[20px]">
                  <div className="px-10 flex items-center bg-main/10 border border-main rounded-[20px] text-main text-[1.2rem] font-semibold">
                    제안
                  </div>
                  <span className="my-6 text-wrap pr-4">
                    {suggested_revision}
                  </span>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[1.6rem] font-semibold">
                  <QuestionMarkIcon />
                  이유
                </div>
                <DivBox className="w-full py-6 px-4 text-wrap">{reason}</DivBox>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[1.6rem] font-semibold">
                  <InfoIcon />
                  협상 전략 및 법적 영향
                </div>
                <DivBox className="w-full py-6 px-4 text-wrap">
                  {negotiation_points}
                </DivBox>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between text-[1.6rem] font-semibold">
                  <div className="flex items-center gap-2">
                    <ScalesIcon />
                    참고한 법령
                  </div>
                  <ArrowDownIcon className="mr-[2.1rem]" />
                </div>
                <DivBox className="w-full py-6 px-4 flex justify-between items-center text-wrap">
                  {legal_basis?.law}
                  <ArrowDownIcon className="mr-4" />
                </DivBox>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between text-[1.6rem] font-semibold">
                  <div className="flex items-center gap-2">
                    <BookIcon />
                    참고한 판례
                  </div>
                  <ArrowDownIcon className="mr-[2.1rem]" />
                </div>
                {case_basis?.map(({ case: caseName }, index) => (
                  <DivBox
                    key={index}
                    className="w-full py-6 px-4 flex justify-between items-center text-wrap"
                  >
                    {caseName}
                    <ArrowDownIcon className="mr-4" />
                  </DivBox>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  const agreementDetailArray = agreements.map(
    (
      {
        result,
        content,
        reason,
        suggested_revision,
        negotiation_points,
        legal_basis,
        case_basis,
      },
      index
    ) => {
      return result ? (
        ""
      ) : (
        <div
          key={index}
          className={`inline-block w-[90%] h-[80%] py-8 mx-2${
            index === agreementFalseArray[0]
              ? " ml-[6.5rem]"
              : index === agreementFalseArray.at(-1)
              ? " mr-[6.5rem]"
              : ""
          } rounded-[40px] snap-center align-top bg-white overflow-y-auto max-h-[80svh]`}
        >
          <div className="flex flex-col justify-center items-center px-8">
            <div className="w-full flex items-center text-[1.4rem] font-medium text-[#FF9500]">
              <span className="flex-shrink-0 w-[1.4rem] h-[1.4rem] rounded-full bg-[#FF9500]" />
              &nbsp;- 확인 필요 특약 사항
              {` (${agreementFalseArray.findIndex((v) => v === index) + 1}/${
                agreementFalseArray.length
              })`}
            </div>
            <hr className="w-[calc(100%+4rem)] my-4 -mx-4 border-0 border-t border-t-[#F3F4F6]" />
            <div className="w-full flex flex-col justify-center items-center gap-12">
              <div className="w-full flex flex-col justify-center items-center gap-4">
                <div className="w-full text-[1.6rem] text-start">
                  <span className="font-semibold">{index + 1 + "번 "}</span>
                  특약 사항
                </div>
                <div className="w-full flex gap-4 text-[1.2rem] text-black/70 border border-[#F3F4F6] rounded-[20px]">
                  <span className="px-10 flex items-center border border-[#F3F4F6] rounded-[20px] text-[1.2rem] font-semibold">
                    원본
                  </span>
                  <span className="my-6 text-wrap pr-4">{content}</span>
                </div>
                <div className="w-full flex gap-4 bg-main/5 text-[1.2rem] border border-main rounded-[20px]">
                  <div className="px-10 flex items-center bg-main/10 border border-main rounded-[20px] text-main text-[1.2rem] font-semibold">
                    제안
                  </div>
                  <span className="my-6 text-wrap pr-4">
                    {suggested_revision}
                  </span>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[1.6rem] font-semibold">
                  <QuestionMarkIcon />
                  이유
                </div>
                <DivBox className="w-full py-6 px-4 text-wrap">{reason}</DivBox>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[1.6rem] font-semibold">
                  <InfoIcon />
                  협상 전략 및 법적 영향
                </div>
                <DivBox className="w-full py-6 px-4 text-wrap">
                  {negotiation_points}
                </DivBox>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between text-[1.6rem] font-semibold">
                  <div className="flex items-center gap-2">
                    <ScalesIcon />
                    참고한 법령
                  </div>
                  <ArrowDownIcon className="mr-[2.1rem]" />
                </div>
                <DivBox className="w-full py-6 px-4 flex justify-between items-center text-wrap">
                  {legal_basis?.law}
                  <ArrowDownIcon className="mr-4" />
                </DivBox>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between text-[1.6rem] font-semibold">
                  <div className="flex items-center gap-2">
                    <BookIcon />
                    참고한 판례
                  </div>
                  <ArrowDownIcon className="mr-[2.1rem]" />
                </div>
                {case_basis.map(({ case: case_name }, index) => (
                  <DivBox
                    key={index}
                    className="w-full py-6 px-4 flex justify-between items-center text-wrap"
                  >
                    {case_name}
                    <ArrowDownIcon className="mr-4" />
                  </DivBox>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  useEffect(() => {
    if (modalOpen && containerRef.current) {
      const container = containerRef.current;
      const target = container.children[
        activeTitle ? agreementDetailArrayIndex : articleDetailArrayIndex
      ] as HTMLElement | undefined;
      if (target) {
        container.scrollTo({
          left: target.offsetLeft - container.offsetLeft,
          behavior: "instant",
        });
      }
    }
  }, [
    modalOpen,
    articleDetailArrayIndex,
    agreementDetailArrayIndex,
    activeTitle,
  ]);

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <BackHeader to="/">월세 임대차 계약서</BackHeader>
      <main className="flex flex-col items-center mt-[3rem] gap-12 h-auto">
        <div className="w-full my-12 flex flex-col gap-4 justify-center items-center">
          <div className="mx-16 px-8 py-6 gap-12 flex justify-center items-center bg-white rounded-[20px]">
            <span className="w-full flex-1 text-[1.4rem] font-medium text-[#32D74B]">
              <span className="inline-block align-middle w-[1.4rem] h-[1.4rem] rounded-full bg-[#32D74B]" />
              &nbsp;- 문제 없음
            </span>
            <span className="w-full flex-1 text-[1.4rem] font-medium text-[#FF9500]">
              <span className="inline-block align-middle w-[1.4rem] h-[1.4rem] rounded-full bg-[#FF9500]" />
              &nbsp;- 확인 필요
            </span>
          </div>
          <div className="w-full p-8 flex flex-col gap-12 items-center justify-center bg-white opacity-70 rounded-[50px]">
            <span className="text-center text-[1.8rem] font-semibold">
              {activeTitle ? "특약 사항" : "계약 조항"} 목록
            </span>
            <ul className="w-full flex flex-col gap-4 items-center justify-center">
              {activeTitle ? agreementArray : articleArray}
            </ul>
          </div>
        </div>
        <DivBox className="mb-6 w-full flex flex-col gap-12">
          <div className="flex w-full justify-between items-center">
            {titleArray[Number(activeTitle)]}
          </div>
        </DivBox>
      </main>
      <Modal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        clickOutsideClose={true}
        isCenter={true}
        ref={containerRef}
      >
        {activeTitle ? agreementDetailArray : articleDetailArray}
      </Modal>
    </>
  );
}

export default AnalysisResultPage;
