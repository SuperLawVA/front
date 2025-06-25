"use client";
import Image from "next/image";

const dummyLaws = [
  {
    title: "주택임대차보호법 제8조 (전세보증금 미반환 방지)",
    content: "임대인은 임차인에게 전세보증금 반환을 지체할 수 없다. 임차인이 반환받지 못할 경우 법적 조치가 가능하다.",
  },
  {
    title: "민법 제635조(임대차의 정의)",
    content: "임대인은 임차인에게 목적물을 사용, 수익하게 하고 ...",
  },
];

export default function LawSection({ query }: { query: string }) {
  const words = query.trim().split(/\s+/).filter(Boolean);
  const filtered =
    words.length === 0
      ? []
      : dummyLaws.filter(law => words.some(word =>
          law.title.includes(word) || law.content.includes(word)
        ));

  return (
    <div>
      <div className="flex items-center gap-2 justify-center mb-8 mt-8">
        <Image src="/법령.svg" alt="icon" width={18} height={18} />
        <span className="text-[1.5rem] font-medium">유사한 법령</span>
      </div>
      <div className="w-full px-2 space-y-8">
        {filtered.length === 0 ? (
          <>
            <div className="flex justify-center mt-20">
              <Image src="/Group 632642.svg" alt="운다" width={200} height={200} />
            </div>
            <div className="text-gray-800 text-[1.2rem] text-center mt-4">
              검색 결과가 없어요<br />다른 검색어를 시도해 보세요
            </div>
          </>
        ) : (
          filtered.map(law => (
            <div key={law.title} className="flex flex-col pl-5 pr-5">
              <div className="font-bold text-[1.2rem] mb-2">{law.title}</div>
              <div className="text-[1.1rem] whitespace-pre-line text-gray-700">{law.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}