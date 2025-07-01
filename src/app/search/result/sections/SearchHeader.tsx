"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";


export default function SearchHeader({ query, setQuery, onSubmit }: {
  query: string, setQuery: (v: string) => void, onSubmit: () => void
}) {
  const router = useRouter();

  return (
      <div className="px-6 pt-6 mt-5 ml-8">  
        <div className="relative text-[1.4rem]">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSubmit()}
            placeholder="검색어를 입력하세요"
            className="h-16 bg-[#f3f4f6] rounded-full pl-16 pr-24 text-[1.15rem] focus:outline-none focus:ring-2 focus:ring-[#6000FF]/30"
          />
            <div className="absolute inset-y-0 left-4 pl-2 flex items-center pointer-events-none">
              <Image src="/search.svg" alt="검색" width={16} height={16} />
            </div>
            <button
              className="absolute inset-y-0 right-8 flex items-center px-4 font-medium text-[#6000FF]"
              onClick={() => router.back()}
            >
              취소
            </button>
          </div>
        </div>
  );
}