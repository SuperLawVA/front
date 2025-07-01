"use client";

import Image from "next/image";

export default function CaseSection({ query }: { query: string }) {
  // 예시 판례
  const dummyCases = [
    { title: "대법원 2020다12345", desc: `"${query}" 관련 판례 요약 내용` },
  ];

  // 실제로는 판례 데이터 받아서 처리 (여긴 항상 검색결과 없는 케이스도 대비)
  const filtered = query.trim().length === 0
    ? []
    : dummyCases.filter(c => c.title.includes(query) || c.desc.includes(query));

  return (
    <div>
      <div className="flex items-center gap-2 justify-center mb-8 mt-8">
        <Image src="/openBook.png" alt="오픈북" width={18} height={18} />
        <span className="text-[1.5rem] font-medium">유사한 판례</span>
      </div>
      <div className="w-full px-2 space-y-8">
        {filtered.length === 0 ? (
          <div>
            <div className="flex justify-center mt-20">
              <Image src="/Group 632642.svg" alt="운다" width={200} height={200} />
            </div>
            <div className="text-gray-800 text-[1.2rem] text-center mt-8">
              검색 결과가 없어요<br />다른 검색어를 시도해 보세요
            </div>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.title} className="flex flex-col pl-5 pr-5">
              <div className="font-bold text-[1.2rem] mb-2">{item.title}</div>
              <div className="text-[1.1rem] whitespace-pre-line text-gray-700">{item.desc}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}