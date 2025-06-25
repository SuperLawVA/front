"use client";
import Image from "next/image";

export default function NoResult({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center mt-20 mb-8">
      <Image src="/Group 632642.svg" alt="검색 결과 없음" width={180} height={180} />
      <div className="text-gray-800 text-[1.2rem] text-center mt-6">
        {text || <>검색 결과가 없어요<br />다른 검색어를 시도해 보세요</>}
      </div>
    </div>
  );
}