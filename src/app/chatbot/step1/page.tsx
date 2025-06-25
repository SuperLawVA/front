// app/chatbot/step1/page.tsx
"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

type Msg = { role: "user" | "assistant"; text: string };

function ChatbotPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        "안녕하세요! 일상에서 마주치는 법률 고민,\n혼자 해결하기 어려우셨죠?\n\n" +
        "**부동산 관련 고민**을\n실제 판례와 법령을 바탕으로 친절하게 해결해 드릴게요!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(text: string) {
    // ① 사용자 말풍선 즉시 출력
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const { default: api } = await import("@/lib/axios");
      const { data } = await api.post(
        "/api/chat",
        { question: text },
        { withCredentials: true }
      );

      // ② 챗봇 답변
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "답변 중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    inputRef.current!.value = "";
    await sendMessage(q);
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
      <header className="flex items-center px-8 pt-6 gap-4 mt-10">
        <Image src="/menu1.svg" alt="메뉴" width={45} height={45} />
        <div className="flex-1 h-16 bg-white rounded-[20px] flex items-center px-6 text-[1.6rem] font-semibold">
          새 채팅
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <Image
          src="/logo.svg"
          alt="로고"
          width={150}
          height={160}
          className="opacity-35 select-none"
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pt-6 space-y-6">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="flex items-start justify-start gap-1">
              <Image
                src="/chatchat.svg"
                alt="bot"
                width={24}
                height={24}
                className="ml-2 mt-6 flex-shrink-0"
              />
              <div
                className="
                  -ml-5 max-w-[80%] whitespace-pre-line bg-violet-200/30 text-black
                  px-8 py-3 text-[1.3rem] mt-18
                  rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] rounded-tl-none
                "
              >
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start justify-end">
              <div className="relative max-w-[80%]">
                {/* 말풍선 */}
                <div
                  className="
                    whitespace-pre-line bg-white text-black
                    px-8 py-3 text-[1.3rem] mt-8 mr-2
                    rounded-tl-[30px] rounded-bl-[30px] rounded-br-[30px] rounded-tr-none
                  "
                >
                  {m.text}
                </div>
                {/* 오른쪽 위 보라 원 */}
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

      <footer className="sticky bottom-10 w-full bg-[#F2F1F6] pt-4">
        <section className="px-4 mb-3">
          <span className="inline-block !text-[1.05rem] ml-4 font-medium">
            추천 질문
          </span>
          <div className="max-h-[15svh] mt-2 flex gap-2 flex-wrap items-center overflow-y-auto whitespace-nowrap">
            {quick.map((q, i) => (
              <button
                key={i}
                onClick={() => onQuick(q)}
                className="shrink-0 !text-sm px-4 py-[0.6rem] rounded-full border border-[#E0E0E0] bg-white hover:bg-gray-50"
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        {/* 입력창 */}
        <form onSubmit={handleSubmit} className="px-4 pb-6 mt-5">
          <div className="relative flex w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="부동산 관련 상담을 도와드릴게요"
              className="
                w-full bg-white rounded-full py-5 pl-5 pr-14
                text-[1rem] placeholder-gray-500 outline-none
              "
            />
            <button
              type="submit"
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                w-8 h-8 flex justify-center items-center
                rounded-full bg-violet-600 active:scale-95
              "
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
