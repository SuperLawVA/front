"use client";

import Image from "next/image";

const dummyTerms = [
  { title: "전세", desc: "집을 빌릴 때 집주인에게 보증금을 한 번에 맡기고,\n그 대신 매달 월세를 내지 않고 집에 사는 방법" },
  { title: "보증금", desc: "집을 빌릴 때 나중에 돌려받기로 하고,\n집주인에게 미리 맡기는 큰돈" },
  { title: "미반환", desc: "계약이 끝났는데도 집주인이\n보증금이나 전세금을 돌려주지 않는 상황" },
];

export default function TermSection({ query }: { query: string }) {
  const words = query.trim().split(/\s+/).filter(Boolean);

  // 검색어(여러 단어 중) 하나라도 title에 포함되면 보여줌
  const filtered =
    words.length === 0
      ? []
      : dummyTerms.filter(t => words.some(word => t.title.includes(word)));

  return (
    <div>
      <div className="flex items-center gap-2 justify-center mb-8 mt-8">
        <Image src="/book.svg" alt="icon" width={16} height={16} />
        <span className="text-[1.5rem] font-medium">용어 설명</span>
      </div>
      <div className="w-full px-2 space-y-8">
        {filtered.length === 0 ? (
          <>
            <div className="flex justify-center mt-20">
              <Image src="/Group 632642.svg" alt="운다" width={200} height={200} />
            </div>
            <div className="text-gray-800 text-[1.2rem] text-center">
              검색 결과가 없어요<br />다른 검색어를 시도해 보세요
            </div>
          </>
        ) : (
          filtered.map(item => (
            <div key={item.title} className="relative mt-5">
              <div className="flex items-center absolute -top-6 left-8 bg-white z-10 pr-2">
                <span className="text-[1.6rem] font-bold">{item.title}</span>
              </div>
              <div className="border border-gray-200 rounded-[25px] pt-8 pb-5 px-7 bg-white">
                <p className="text-[1.2rem] whitespace-pre-line text-gray-700 text-center">{item.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}