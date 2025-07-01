// components/QnaSection.tsx
"use client";

import Image from "next/image";

const dummyQnas = [
  {
    id: 1,
    question: "전세보증금 미반환 시 어떻게 해야 하나요?",
    answer: "임대인이 보증금을 반환하지 않으면 내용증명 발송, 지급명령, 소송 등 다양한 법적 조치가 가능합니다.",
  },
  {
    id: 2,
    question: "전세 계약 만료 후 집주인이 연락이 안돼요.",
    answer: "계약서, 입증자료를 준비해서 법적 절차(내용증명, 소송 등)를 진행할 수 있습니다.",
  },
];

export default function FaqSection({ query }: { query: string }) {
  // query로 필터링(예시)
  const filtered = query.trim().length === 0
    ? []
    : dummyQnas.filter(qna => qna.question.includes(query) || qna.answer.includes(query));

  return (
    <div>
      <div className="flex items-center gap-2 justify-center mb-8 mt-8">
        <span className="text-[1.5rem] font-medium text-[#6000ff]">FAQ</span>
      </div>
      <div className="w-full px-2 space-y-8">
        {filtered.length === 0 ? (
          <div>
            <div className="flex justify-center mt-20">
              <Image src="/Group 632642.svg" alt="운다" width={200} height={200} />
            </div>
            <div className="text-gray-800 text-[1.2rem] text-center mt-4">
              검색 결과가 없어요<br />다른 검색어를 시도해 보세요
            </div>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="flex flex-col pl-5 pr-5">
              <div className="font-bold text-[1.1rem] mb-2">Q. {item.question}</div>
              <div className="text-gray-700 mt-2 pl-2 border-l-4 border-[#6000ff]">A. {item.answer}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}