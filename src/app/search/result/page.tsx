"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchHeader from "@/app/search/result/sections/SearchHeader";
import TermSection from "@/app/search/result/sections/TermSection";
import LawSection from "@/app/search/result/sections/LawSection";
import CaseSection from "@/app/search/result/sections/CaseSection";
import FaqSection from "@/app/search/result/sections/FaqSection";
import BackHeader from "@/components/BackHeader";
import axios from "axios";
import clientApi from "@/lib/axios.client";

const tabList = ["용어집", "법령", "판례", "FAQ"];

function SearchResultPage() {
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  // const [pageParam, setPageParam] = useState(1);
  const pageParam = 1;
  const [resultValue, setResultValue] = useState<
    { word: string; content: string }[]
  >([]);

  const handleSubmit = async (sendQuery: string) => {
    if (!sendQuery.trim()) return;

    try {
      const response = await clientApi.post("/search", {
        sendQuery,
        pageParam,
      });

      console.log("[SEARCH SUCCESS RESPONSE]", response);

      if (response.data) {
        setResultValue(response.data.data); // ✅ data.data에 결과 배열
      }
    } catch (error) {
      console.error("[SEARCH ERROR]", error);

      if (axios.isAxiosError(error) && error.response) {
        console.log("[AXIOS ERROR RESPONSE]", error.response);
      }
    }
  };

  // 페이지 로드 또는 queryParam 변경 시 검색 실행
  useEffect(() => {
    setQuery(queryParam); // URL param으로 query state 갱신
    handleSubmit(queryParam);
  }, [queryParam]);

  return (
    <div className="bg-[#f2f1f6] min-h-screen flex flex-col relative">
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <BackHeader>메인화면</BackHeader>
      <div className="flex-1 bg-white rounded-t-[40px] px-4 pb-36 mt-10 overflow-y-auto">
        {/* 검색창 */}
        <div className="pb-4">
          <SearchHeader
            query={query}
            setQuery={setQuery}
            onSubmit={() => handleSubmit(query)} // ✅ 검색 버튼 클릭 시 검색 실행
          />
        </div>

        {/* 검색 결과 표시 */}
        <div className="space-y-4">
          {resultValue.length > 0 ? (
            resultValue.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg shadow bg-gray-50"
              >
                <h3 className="text-lg font-bold">{item.word}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>

        {/* 탭별 콘텐츠 */}
        {activeTab === 0 && <TermSection query={query} />}
        {activeTab === 1 && <LawSection query={query} />}
        {activeTab === 2 && <CaseSection query={query} />}
        {activeTab === 3 && <FaqSection query={query} />}
      </div>

      {/* 하단 네비 */}
      <div className="fixed left-0 bottom-20 w-full z-20 flex justify-center">
        <div className="w-[90%] border border-gray-300 bg-white text-[1.3rem] flex rounded-[20px]">
          {tabList.map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-4 rounded-[20px] font-bold transition-colors duration-150 ${
                activeTab === i ? "bg-[#6000ff] text-white" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;
