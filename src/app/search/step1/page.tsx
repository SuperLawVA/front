"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import BackHeader from "@/components/BackHeader";

function StepPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  // const [recent, setRecent] = useState<string[]>([]);
  // const removeRecent = (kw: string) => {
  //   setRecent((prev) => prev.filter((k) => k !== kw));
  // };

  const doSearch = () => {
    if (!query.trim()) return;
    router.push(`/search/step1?q=${encodeURIComponent(query)}`);
  };

  // 해시태그, 용어 데이터 하드코딩
  const popularKeywords = [
    "#임차권등기명령",
    "#전세보증금 반환 소송",
    "#확정일자",
    "#월세",
    "#소액심판 청구",
    "#임대차",
  ];
  const terms = [
    {
      title: "전세",
      desc: "집을 빌릴 때 집주인에게 보증금을 한 번에 맡기고,\n그 대신 매달 월세를 내지 않고 집에 사는 방법",
    },
    {
      title: "보증금",
      desc: "집을 빌릴 때 나중에 돌려받기로 하고,\n집주인에게 미리 맡기는 큰돈",
    },
    {
      title: "미반환",
      desc: "계약이 끝났는데도 집주인이\n보증금이나 전세금을 돌려주지 않는 상황",
    },
  ];

  return (
    <div className="bg-[#f2f1f6] min-h-screen pt-2">
      {/* 헤더 */}
      <div className="flex items-center mt-35">
        <button onClick={() => router.back()}>
          <BackHeader />
        </button>
        <span className="ml-4 text-[1.6rem] font-bold">메인 화면</span>
      </div>
      <div className="flex flex-col fixed mt-10 rounded-t-[40px] h-auto bg-[#FFFFFF]">
        {/* 검색창 */}
        <div className="px-6 pt-6 ml-8 mt-5">
          <div className="relative text-[1.4rem]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="전세 보증금 미반환"
              className="
                w-115 h-17
                bg-[#f3f4f6] placeholder-gray-400
                rounded-full
                pl-16
                focus:outline-none focus:ring-2 focus:ring-[#6000FF]/30
              "
            />
            <div className="absolute inset-y-0 left-4 pl-2 flex items-center pointer-events-none">
              <Image src="/search.svg" alt="검색" width={16} height={16} />
            </div>
            <button
              className="absolute inset-y-0 right-5 flex items-center px-4 font-medium text-[#6000FF]"
              onClick={() => router.back()}
            >
              취소
            </button>
          </div>
        </div>
        {/* 용어 설명 */}
        <div className="flex flex-col items-center mt-10">
          <div className="flex items-center gap-2">
            <Image src="/book.svg" alt="닫힌 책" width={13} height={13} />
            <span className="text-[1.7rem] font-bold">용어 설명</span>
          </div>
          <div className="w-full mt-8 px-6 space-y-10">
            {terms.map((item) => (
              <div key={item.title} className="relative mt-5">
                <div className="flex items-center absolute -top-6 left-8 bg-white z-10 pr-2">
                  <span className="text-[1.7rem] mt-1 ml-2">{item.title}</span>
                </div>
                <div className="border border-gray-200 rounded-[25px] pt-6 pb-6 px-7 bg-white">
                  <p className="text-[1.2rem] whitespace-pre-line text-gray-700 text-center">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 검색어 */}
        <div className="w-full mt-12 mb-8 px-6 flex flex-col items-center">
          {/* 타이틀과 선 */}
          <div className="flex items-center w-full justify-center mb-[-1.5rem]">
            <div className="mx-6 flex items-end bg-white px-2">
              <span className="text-[1.7rem] text-[#8b2cff] font-bold mr-1">
                #
              </span>
              <span className="text-[1.7rem] font-bold">인기 검색어</span>
            </div>
          </div>
          {/* 박스 */}
          <div className="border border-gray-200 rounded-[30px] bg-white w-full px-4 py-10 flex flex-wrap justify-center gap-4 mt-4">
            {popularKeywords.map((tag) => (
              <span
                key={tag}
                className="px-6 py-2 bg-[#f3f3f3] rounded-full text-gray-900 text-[1.1rem] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* 하단 네비게이션 */}
        <div
          className="
            fixed border border-gray-300 
            text-[1.3rem] gap-8 bg-white 
            flex justify-center items-center 
            rounded-[20px] bottom-15 left-5
            "
        >
          {["용어집", "법령", "판례", "Q&A"].map((tab, i) => (
            <button
              key={tab}
              className={`px-10 py-4 rounded-full font-bold ${
                i === 0 ? "bg-[#6000ff] text-white" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StepPage;
