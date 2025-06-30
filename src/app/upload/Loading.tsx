"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressRing from "@/components/ProgressRing2";
import SubmitButton from "@/components/SubmitButton";
import Image from "next/image";

function LoadingPage() {
  const router = useRouter();
  console.log(router);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const TOTAL_DURATION_MS = 15000; // 45초
    const INTERVAL_MS = 120;
    const TOTAL_STEPS = TOTAL_DURATION_MS / INTERVAL_MS;
    const INCREMENT = 100 / TOTAL_STEPS;

    const id = setInterval(() => {
      setProgress((p) => {
        if (p + INCREMENT >= 100) {
          return 0; // 100에 도달하면 0으로 초기화
        }
        return p + INCREMENT;
      });
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, []);
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setProgress((p) => Math.min(p + 2, 100));
  //   }, 120);
  //   return () => clearInterval(id);
  // }, []);

  // const goNext = () => router.push("step3");

  return (
    <main
      className="min-h-screen min-w-screen flex flex-col items-center px-6 text-center z-50
    fixed left-1/2 -translate-x-1/2"
    >
      <div>
        {progress <= 100 ? (
          <>
            <h1 className="mt-70 text-[2rem] font-bold mb-2">
              이미지의 텍스트를 읽는 중입니다.
            </h1>
            <p className="text-[1.4rem] font-medium">
              편집 페이지에서 계약서 내용을 수정할 수 있어요.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-70 text-[2rem] font-bold mb-2">
              특약 사항 생성 완료!
            </h1>
            <p className="text-[1.4rem] font-medium">
              특약 사항이 어떻게 완성되었는지 보러 가실까요?
            </p>
          </>
        )}
      </div>
      <div className="mt-25 flex flex-col">
        <ProgressRing
          size={200}
          stroke={5}
          progress={progress}
          from="#6040FF"
          to="#E100FF"
          runningLabel="진행 중"
          doneLabel="완료"
        />
      </div>
      <div className="fixed bottom-1 mb-20 w-[90%] left-1/2 -translate-x-1/2">
        {progress < 100 ? (
          <div className="font-bold h-20 bg-[#fefce8] rounded-[20px] pl-5 pt-3 gap-2 text-sm flex items-start">
            {/* <Image
              src="/warning.png"
              alt="warningIcon"
              width={27}
              height={26}
              className="flex-shrink-0 mt-2"
            />
            <div>
              <p className="text-[1.2rem] text-start">경고</p>
              <span className="text-subText font-normal">
                본 결과는 법령·사례 기반 학습된 AI로, 잘못된 답변을 낼 수도
                있습니다.
              </span>
            </div> */}
          </div>
        ) : (
          <SubmitButton
            width={30}
            height={5.5}
            fontSize={1.7}
            className=""
            // onClick={goNext}
          >
            결과보기
          </SubmitButton>
        )}
      </div>
    </main>
  );
}

export default LoadingPage;
