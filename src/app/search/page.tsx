// app/search/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import clientApi from "@/lib/axios.client";
import axios from "axios";

function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pageParam, setPageParam] = useState(1);
  const [resultValue, setResultValue] = useState();
  // const [recent, setRecent] = useState<string[]>([]);
  // const removeRecent = (kw: string) => {
  //   setRecent((prev) => prev.filter((k) => k !== kw));
  // };

  // 최근 검색어 (초깃값)
  const [recentKeywords, setRecentKeywords] = useState<string[]>([
    "임대차 계약서",
    "보증금 반환",
    "내용 증명서",
  ]);

  const onDeleteRecent = (keyword: string) => {
    setRecentKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const doSearch = () => {
    if (!query.trim()) return;
    router.push(`/search/step1?q=${encodeURIComponent(query)}`);
  };

  const goToSearchResult = (q?: string) => {
    // q를 넘겨서 결과 페이지로 이동하고 싶으면:
    // router.push(`/search/results?q=${encodeURIComponent(q ?? "")}`)
    // 아직 결과 페이지가 없으면 단순히 뒤로 가기 또는 아무 동작 없이 놔두세요.
    console.log("search for:", q);
  };

  const handleSubmit = async (sendQuery: string) => {
    try {
      const response = await clientApi.post("/search", {
        sendQuery,
        pageParam,
      });
      console.log("[SEARCH SUCCESS RESPONSE]", response);
      if (response.data.success) {
        console.log(response);
      }
      console.log("response");
      console.log(response);
      console.log("response");
      setResultValue(response.data);
    } catch (error) {
      console.error("[SEARCH ERROR]", error);

      // ✅ Axios error라면 response에 서버 메시지 있음
      if (axios.isAxiosError(error) && error.response) {
        console.log("[AXIOS ERROR RESPONSE]", error);
        // alert(error.response.data?.message || "로그인 실패 (서버 응답 있음)");
      } else {
        // 네트워크 등 기타
        ("");
        // alert("로그인 요청 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };
  useEffect(() => {
    handleSubmit(query);
  }, [query]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-20 bg-white z-10" />
      <div className="pt-20 bg-white min-h-screen z-0">
        <div className="px-6 pt-6 ml-5">
          <div className="relative text-[1.4rem]">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                // sessionStorage.setItem("searchQuery", e.target.value);
                // handleSubmit(e.target.value);
                setQuery(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="무엇을 도와드릴까요?"
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
        <section className="mt-8 px-6">
          <h3 className="text-[1.2rem] font-mideum mb-2 ml-4">인기 검색어</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2 text-[1.2rem] ml-10 mt-8 gap-4">
            {["월세", "소액심판 청구", "임대차", "전세보증금 반환 소송"].map(
              (kw) => (
                <button
                  key={kw}
                  className="flex-shrink-0 pl-4 pr-4 px-3 py-1 bg-[#f3f3f3] text-gray-900 rounded-full"
                  onClick={() => {
                    setQuery(kw);
                    doSearch();
                  }}
                >
                  {kw}
                </button>
              )
            )}
          </div>
        </section>
        <section className="mt-4 px-6">
          <h3 className="text-[1.2rem] font-medium mb-2 mt-8 ml-4">
            최근 검색어
          </h3>
          <ul className="space-y-3 text-[1.4rem] mt-4 ml-2">
            {recentKeywords.map((kw) => (
              <li key={kw} className="flex justify-between items-center">
                <button
                  className="text-gray-500 text-left flex-1"
                  onClick={() => goToSearchResult(kw)}
                >
                  {kw}
                </button>
                <button
                  className="px-2 "
                  onClick={() => onDeleteRecent(kw)}
                  aria-label={`최근 검색어 '${kw}' 삭제`}
                >
                  <span className="text-[2rem] text-gray-400">×</span>
                </button>
              </li>
            ))}
            {recentKeywords.length === 0 && (
              <li className="text-[1.3rem] ml-45 text-gray-400">
                최근 검색 내역이 없습니다
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
export default SearchPage;
