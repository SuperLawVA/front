"use client";

import { useRef, useState, FormEvent } from "react";
import Image from "next/image";

type AnswerFormat = {
  summary: string;
  law: string;
  caseExample: string;
  term: string;
};
type Msg = { role: "user" | "assistant"; text: string | AnswerFormat };

function getAssistantAnswer(q: string): AnswerFormat {
  // 이 부분은 실제로는 AI 모델을 호출하거나, 백엔드 API를 통해 답변을 받아오는 로직이 들어가야 합니다.
  // build용 Log
  console.log(q);

  return {
    summary:
      "임대차 보증금을 돌려받지 못한 상황으로, 이는 임대차 계약에 따른 보증금 반환 문제로 인해 발생한 것으로 이해하겠습니다.",
    law: "관련 법률인 '임대차 보증금 반환'에 관한 법률을 확인하여 보증금 반환 절차 및 조건을 파악하고, 이를 토대로 상대방과 협의해 보증금 반환을 요구할 수 있습니다.",
    caseExample:
      "판례를 통해 유사한 상황에서 어떻게 보증금 반환이 이루어졌는지 확인하고, 해당 사례를 참고하여 대응 방안을 모색할 수 있습니다.",
    term: "임대차 보증금이란 임대인이 임차인에게 임대차 계약을 체결할 때 요구하는 금액으로, 임차인이 임대료를 손상시키거나 임대차 계약을 위반할 경우 보상으로 사용하는 금액입니다.",
  };
}

function ChatbotPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "안녕하세요! 일상에서 마주치는 법률 고민,\n혼자 해결하기 어려우셨죠?\n\n**부동산 관련 고민**을 실제 판례와 법령을 바탕으로 친절하게 해결해 드릴게요!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(text: string) {
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    // 실제라면 await axios로!
    const answer = getAssistantAnswer(text);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
      setLoading(false);
    }, 600);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    inputRef.current!.value = "";
    sendMessage(q);
  }

  const quick = [
    "임대차 보증금 반환에 관한 법률은 무엇인가요?",
    "이와 유사한 사례나 판례를 알고 싶어요",
    "집주인이 보증금을 안 돌려줘요",
    "집에 물이 떨어지는데 어떻게 하죠",
  ];

  function onQuick(q: string) {
    if (loading) return;
    sendMessage(q);
  }

  return (
    <div className="flex flex-col h-screen bg-[#F2F1F6]">
      {/* 헤더 */}
      <header className="flex items-center px-8 pt-6 gap-4 mt-10">
        <Image src="/menu1.svg" alt="메뉴" width={45} height={45} />
        <div className="flex-1 h-16 bg-white rounded-[20px] flex items-center px-6 text-[1.6rem] font-semibold">
          새 채팅
        </div>
      </header>
      {/* 배경 로고 */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <Image
          src="/logo.svg"
          alt="로고"
          width={150}
          height={160}
          className="opacity-35 select-none"
        />
      </div>
      {/* 메시지 */}
      <main className="flex-1 overflow-y-auto px-4 pt-6 space-y-6">
        {messages.map((m, i) =>
          m.role === "assistant" && typeof m.text !== "string" ? (
            <div key={i} className="flex items-start justify-start gap-1 mt-6">
              <Image
                src="/chatchat.svg"
                alt="bot"
                width={24}
                height={24}
                className="ml-2 flex-shrink-0"
              />
              {/* 카드 답변 */}
              <div className="bg-violet-100/70 p-8 mt-12 ml-[-1.3rem] rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] rounded-tl-none space-y-3 text-[1.1rem]">
                <div>
                  <span className="font-bold text-[1.15rem]">🙇‍♂️ 상황 정리</span>
                  <div>{(m.text as AnswerFormat).summary}</div>
                </div>
                <div>
                  <span className="font-bold text-[1.09rem]">💡 도움 방법</span>
                  <div className="mt-2">
                    <div className="mb-2">
                      <span className="font-semibold">법률 해결방안:</span>
                      <br />
                      {(m.text as AnswerFormat).law}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">유사 사례:</span>
                      <br />
                      {(m.text as AnswerFormat).caseExample}
                    </div>
                    <div>
                      <span className="font-semibold">용어 설명:</span>
                      <br />
                      {(m.text as AnswerFormat).term}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : m.role === "assistant" ? (
            <div key={i} className="flex items-start justify-start gap-1">
              <Image
                src="/chatchat.svg"
                alt="bot"
                width={24}
                height={24}
                className="ml-2 mt-6 flex-shrink-0"
              />
              <div className="-ml-5 max-w-[80%] whitespace-pre-line bg-violet-200/30 text-black px-8 py-3 text-[1.3rem] mt-18 rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] rounded-tl-none">
                {m.text as string}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start justify-end">
              <div className="relative max-w-[80%]">
                <div className="whitespace-pre-line bg-white text-black px-8 py-3 text-[1.3rem] mt-8 mr-2 rounded-tl-[30px] rounded-bl-[30px] rounded-br-[30px] rounded-tr-none">
                  {m.text as string}
                </div>
                <span className="absolute -top-2 -right-2 w-[2rem] h-[2rem] bg-violet-400 rounded-full" />
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="mr-auto bg-violet-200/30 rounded-[40px] px-5 py-4 text-[0.9rem] animate-pulse">
            답변 생성 중...
          </div>
        )}
        <div className="h-36" />
      </main>

      {/* 추천질문 + 입력창 */}
      <footer className="sticky bottom-10 w-full bg-[#F2F1F6] pt-4">
        <section className="px-4 mb-3">
          <span className="inline-block text-[1.05rem] ml-4 font-medium">
            추천 질문
          </span>
          <div className="mt-2 flex gap-2 overflow-x-auto whitespace-nowrap">
            {quick.map((q, i) => (
              <button
                key={i}
                onClick={() => onQuick(q)}
                className="shrink-0 text-sm px-4 py-[6px] rounded-full border border-[#E0E0E0] bg-white hover:bg-gray-50"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
        <form onSubmit={handleSubmit} className="px-4 pb-6 mt-5">
          <div className="relative flex w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="부동산 관련 상담을 도와드릴게요"
              className="w-full bg-white rounded-full py-5 pl-5 pr-14 text-[1rem] placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex justify-center items-center rounded-full bg-violet-600 active:scale-95"
            >
              <Image src="/send.svg" alt="보내기" width={18} height={18} />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}

export default ChatbotPage;
