"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import StatusIcon from "@/components/icons/Status";
import { useEffect, useState } from "react";
import AlarmIcon from "@/components/icons/Alarm";
import BottomNav from "@/components/BottomNav";
import DocumentIcon from "@/components/icons/Document";
import AnalysisIcon from "@/components/icons/Analysis";
import InfoIcon from "@/components/icons/Info";
import UploadIcon from "@/components/icons/Upload";
import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlass";
import { Contract, RecentChat } from "./types/Main";
import ChatIcon from "@/components/icons/Chat";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { logout } from "@/lib/logout";
import { useAuthStore } from "@/store/useStore";
import axios from "axios";
import { persist } from "zustand/middleware";

interface QuickButtonProps {
  bgc: string;
  icon: React.ReactNode;
  title?: string;
  description?: string;
  fontSize?: number;
  descFontSize?: number;
}

function QuickButton({
  bgc,
  fontSize = 1.2,
  descFontSize = 0.8,
  icon,
  title,
  description,
}: QuickButtonProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <button
        className="flex justify-center items-center w-20 h-20 rounded-[20px] mb-2"
        style={{ backgroundColor: bgc }}
      >
        {icon && <span>{icon}</span>}
      </button>
      <div className={"text-base font-semibold text-[" + fontSize + "rem]"}>
        {title}
      </div>
      <span className={"text-[" + descFontSize + "rem] text-subText"}>
        {description}
      </span>
    </div>
  );
}

function MainPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [notification, setNotification] = useState<number[]>([]);
  const [contractArray, setContractArray] = useState<Contract[]>([]);
  const [recentChat, setRecentChat] = useState<RecentChat[]>([]);

  // 임시 로그아웃
  const handleLogout = async () => {
    useAuthStore.persist.clearStorage();
    sessionStorage.clear();
    await axios.post("/api/logout");
    sessionStorage.setItem("start", "true");
    router.replace("/login"); // 로그아웃 후 로그인 페이지로 이동
  };
  const getUserData = async () => {
    const response = await axios.post("/api/user");

    if (response) {
      const { userName, notification, contractArray, recentChat } =
        response.data;
      useAuthStore.setState({ ...response.data });
      setUserName(userName);
      setNotification(notification);
      setContractArray(contractArray);
      setRecentChat(recentChat);
    }
  };

  useEffect(() => {
    const { userName, notification, contractArray, recentChat } =
      useAuthStore.getState();

    if (userName) {
      setUserName(userName);
      setNotification(notification);
      setContractArray(contractArray);
      setRecentChat(recentChat);
    } else {
      getUserData();
    }
  }, []);

  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center">
        <StatusIcon className="w-full mt-[1.4rem]" />
      </div>
      <header className="w-full flex justify-center items-center h-24">
        <div className="w-full bg-white border border-inputBox rounded-[50px] flex justify-between items-center p-8 mx-6 gap-4">
          <span className="flex gap-3">
            <img src="logo.svg" className="w-12" alt="" />
            {/* <span className="font-pretendard font-semibold text-[2rem] leading-[120%] tracking-[-0.04em] bg-gradient-to-r from-[#6000FF] to-[#E100FF] bg-clip-text text-transparent"> */}
            {/* 임시 로그 아웃 구현 */}
            <span
              onClick={handleLogout}
              className="font-pretendard font-semibold text-[2rem] leading-[120%] tracking-[-0.04em] bg-gradient-to-r from-[#6000FF] to-[#E100FF] bg-clip-text text-transparent"
            >
              Super LawVA
            </span>
          </span>
          <span className="flex gap-[2.4rem]">
            <AlarmIcon />
            {/* {notification.length} */}
            <span className="w-[2.4rem] h-[2.4rem] rounded-full bg-main"></span>
          </span>
        </div>
      </header>
      <main className="w-full flex flex-col items-center h-auto">
        <div className="self-start mx-16 my-20 text-[2rem] font-bold">
          {userName} 님의 고민
          <br />'<span className="text-main">로바</span>'에서 도와드릴게요!
        </div>
        <div className="w-full px-8 py-10 gap-12 rounded-t-[50px] bg-white flex flex-col items-center">
          <form className="w-full h-full pl-6 pr-4 flex items-center justify-between gap-4 bg-inputBox rounded-[50px]">
            <MagnifyingGlassIcon width={1.6} height={1.6} color="#9ca3af" />
            <input
              type="text"
              name=""
              id=""
              placeholder="무엇을 도와드릴까요?"
              className="my-6 placeholder:text-subText flex-1 !text-[1.4rem]"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <SubmitButton
              width={7}
              height="3rem"
              fontSize={1.2}
              fontWeight={500}
              borderRadius={50}
            >
              검색
            </SubmitButton>
          </form>
          <div className="self-start w-full font-semibold text-[1.8rem] px-8 flex flex-col gap-4">
            빠른 작업
            <div className="flex w-full justify-around">
              <QuickButton
                bgc="#32d74b"
                icon={
                  <DocumentIcon
                    color="white"
                    onClick={() => router.push("create")}
                  />
                }
                title="계약서 작성"
                description="안전한 계약을 원해요"
              />
              <QuickButton
                bgc="#0a84ff"
                icon={
                  <AnalysisIcon
                    color="white"
                    onClick={() => router.push("analysis")}
                  />
                }
                title="계약서 분석"
                description="계약을 검토하고 싶어요"
              />
              <QuickButton
                bgc="#ff453a"
                icon={
                  <InfoIcon
                    color="white"
                    onClick={() => router.push("certificate")}
                  />
                }
                title="내용증명"
                description="문제가 발생했어요"
              />
            </div>
          </div>
          <div className="self-start w-full font-semibold text-[1.8rem] px-8 flex flex-col gap-4">
            내 계약서
            <div className="flex flex-col justify-center items-center gap-4">
              {contractArray?.length === 0 ? (
                <>
                  <div
                    onClick={() => router.push("upload")}
                    className="p-4 flex flex-col gap-4 py-4 justify-center items-center w-full bg-main rounded-[20px] text-white text-[1.2rem] font-medium"
                  >
                    <UploadIcon color="white" width={1.6} height={1.6} />
                    계약서 업로드
                  </div>
                  <span className="text-main text-[1rem]">
                    서비스를 이용하려면 파일을 업로드해주세요!
                  </span>
                </>
              ) : (
                <ul
                  onClick={() => router.push("contract")}
                  className="flex items-center gap-4 py-4 px-8 w-full border-[1.5px] border-[#c6c6c8] rounded-[20px] text-[1.2rem] font-medium"
                >
                  <QuickButton
                    bgc="rgba(96, 0, 255, 0.5)"
                    icon={<DocumentIcon />}
                  />
                  {contractArray.map((contract) => {
                    return (
                      <li
                        key={contract._id}
                        className="flex justify-between w-full"
                      >
                        <div className="flex flex-col gap-[0.2rem] text-[#737373] text-[0.8rem] font-medium">
                          <span className="text-[1.2rem] text-black">
                            {contract.title}
                          </span>
                          <span className="text-[1rem]">
                            {contract.address}
                          </span>
                          <span>{contract.createdAt} 등록</span>
                        </div>
                        <SubmitButton
                          width={4}
                          height={2}
                          fontSize={0.8}
                          fontWeight={500}
                          fontColor="#3c82f6"
                          borderRadius={"50px"}
                          background="#eff6ff"
                          borderColor="#3c82f6"
                        >
                          {contract.state}
                        </SubmitButton>
                      </li>
                    );
                  })}
                </ul>
              )}
              <SubmitButton
                width={10}
                height={3}
                fontSize={1}
                fontWeight={500}
                fontColor="#6000FF"
                borderRadius={"50px"}
                background="#ffffff"
                borderColor="#6000FF"
                onClick={() => router.push("upload")}
              >
                추가하기
              </SubmitButton>
            </div>
          </div>
          <div className="self-start w-full font-semibold text-[1.8rem] px-8 flex flex-col gap-4">
            최근 상담 내용
            <ul className="flex flex-col justify-center items-center gap-4">
              {recentChat.map(({ _id, title }) => (
                <li
                  key={_id}
                  className="flex py-4 justify-between items-center w-full border-[1.5px] border-[#c6c6c8] rounded-[20px] px-[1.5rem]"
                >
                  <span className="flex items-center gap-4 text-[1.2rem] font-medium">
                    <ChatIcon color="#6000FF" />
                    {title}
                  </span>
                  <ArrowRightIcon className="flex justify-self-end" />
                </li>
              ))}
              <SubmitButton
                width={10}
                height={3}
                fontSize={1}
                fontWeight={500}
                fontColor="#6000FF"
                borderRadius={"50px"}
                background="#ffffff"
                borderColor="#6000FF"
              >
                자세히 보기
              </SubmitButton>
            </ul>
          </div>
        </div>
        {/* <div className="h-36 w-full bg-white" /> */}
      </main>
      <BottomNav></BottomNav>
    </>
  );
}

export default MainPage;
