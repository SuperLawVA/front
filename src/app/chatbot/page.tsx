// page.tsx
"use client";

import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MagicIcon from "@/components/icons/Magic";
import clientApi from "@/lib/axios.client";

function StartPage() {
  const router = useRouter();

  // 분석 요청 정보
  const createSession = async () => {
    try {
      const response = await clientApi.post("/chatbot/start", {});
      console.log("chatbot response");
      console.log(response);

      router.push("chatbot/" + response.data._id);
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      return undefined;
    }
  };

  return (
    <>
      <main className="flex flex-col items-center h-full bg-white">
        <div className="h-52 w-full" />
        <SubmitButton
          width={17}
          height={3.2}
          background="#EFFDF4"
          fontSize={1.2}
          fontWeight={700}
          icon={<MagicIcon width={20} height={20} color="#22C55D #22C55D" />}
        >
          <span className="text-green-500">AI로 법률 상담하기</span>
        </SubmitButton>
        <div className="mt-8 text-center text-[2.6rem]/[3.1rem] font-bold">
          사용자 님의 문제를
          <br />
          도와드릴게요!
        </div>
        <Image
          src="/Group 6326461.svg"
          alt="vector Icon"
          width={260}
          height={250}
        />
        <div className="text-[#9ca3af] text-center text-[1.3rem] font-semibold">
          법 조항 10만건, 판례 9만건 기반 AI가
          <br />
          당신의 문제를 상담해 드리겠습니다.
        </div>
        <SubmitButton
          width={26}
          height={5.5}
          fontSize={1.8}
          className="mt-10 flex items-center justify-center gap-x-2 whitespace-nowarp"
          // onClick={() => router.push("/chatbot/step1")}
          onClick={createSession}
        >
          생성하기
        </SubmitButton>
        <div
          onClick={() => router.back()}
          className="mt-8 text-[#797979] text-[1.4rem] font-medium"
        >
          ← 다음에 할래요
        </div>
      </main>
    </>
  );
}

export default StartPage;
