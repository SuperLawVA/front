"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchHeader from "@/app/search/step1/sections/SearchHeader";
import TermSection from "@/app/search/step1/sections/TermSection";
import LawSection from "@/app/search/step1/sections/LawSection";
import CaseSection from "@/app/search/step1/sections/CaseSection";
import FaqSection from "@/app/search/step1/sections/FaqSection";
import BackHeader from "@/components/BackHeader";

const tabList = ["용어집", "법령", "판례", "FAQ"];

function SearchResultPage() {
  const [query, setQuery] = useState("전세보증금 미반환");
  const [activeTab, setActiveTab] = useState(0);

  const router = useRouter();

  return (
    <div className="bg-[#f2f1f6] min-h-screen flex flex-col relative">
      <div className="flex items-center mt-35">
        <button onClick={() => router.back()}>
          <BackHeader />
        </button>
        <span className="ml-4 text-[1.7rem] font-medium">메인 화면</span>
      </div>
      <div className="flex-1 bg-white rounded-t-[40px] px-4 pb-36 mt-10 overflow-y-auto">
        {/* 검색창 - 위쪽에 위치 */}
        <div className="pb-4">
          <SearchHeader
            query={query}
            setQuery={setQuery}
            onSubmit={() => setActiveTab(0)}
          />
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