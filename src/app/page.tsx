"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import AlarmIcon from "@/components/icons/Alarm";
import BottomNav from "@/components/BottomNav";
import DocumentIcon from "@/components/icons/Document";
import AnalysisIcon from "@/components/icons/Analysis";
import InfoIcon from "@/components/icons/Info";
import UploadIcon from "@/components/icons/Upload";
import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlass";
import { Contract, Chat } from "./types/Main";
import ChatIcon from "@/components/icons/Chat";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { useAuthStore } from "@/store/useStore";
import Image from "next/image";
import clientApi from "@/lib/axios.client";

interface QuickButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  ...rest
}: QuickButtonProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <button
        className="flex justify-center items-center w-20 h-20 rounded-[20px] mb-2"
        style={{ backgroundColor: bgc }}
        {...rest}
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
  // const [notification, setNotification] = useState<number[]>([]);
  const [contractArray, setContractArray] = useState<Contract[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  // 임시 로그아웃
  const handleLogout = async () => {
    await clientApi.get("/logout");
    useAuthStore.persist.clearStorage();
    sessionStorage.clear();
    sessionStorage.setItem("start", "true");
    router.replace("/login"); // 로그아웃 후 로그인 페이지로 이동
  };
  const getUserData = async () => {
    const response = await clientApi.post("/user", {});

    if (response) {
      const { userName, contractArray, chats } = response.data;
      console.log("chats");
      console.log(chats);

      useAuthStore.setState({ ...response.data });
      setUserName(userName);
      // setNotification(notification);
      setContractArray(contractArray);
      setChats(chats);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <header className="w-full flex justify-center items-center h-24">
        <div className="w-full bg-white border border-inputBox rounded-[50px] flex justify-between items-center p-8 mx-6 gap-4">
          <span className="flex gap-3">
            <Image
              width={9999}
              height={9999}
              src="logo.svg"
              className="w-12"
              alt=""
            />
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
          {userName}&nbsp;님의 고민
          <br />
          {"'"}
          <span className="text-main">로바</span>
          {"'"}에서 도와드릴게요!
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
              type="button"
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
                  <div className="ml-1">
                    <DocumentIcon
                      color="white"
                      onClick={() => router.push("create")}
                    />
                  </div>
                }
                title="계약서 작성"
                description="안전한 계약을 원해요"
              />
              <QuickButton
                bgc="#0a84ff"
                onClick={() => router.push("analysis")}
                icon={<AnalysisIcon color="white" />}
                title="계약서 분석"
                description="계약을 검토하고 싶어요"
              />
              <QuickButton
                bgc="#ff453a"
                onClick={() => router.push("certificate")}
                icon={<InfoIcon color="white" />}
                title="내용증명"
                description="문제가 발생했어요"
              />
            </div>
          </div>
          <div className="self-start w-full font-semibold text-[1.8rem] px-8 flex flex-col gap-4">
            내 계약서
            <ul className="flex flex-col justify-center items-center gap-4">
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
                contractArray.map((contract) => {
                  return (
                    <li
                      key={contract._id}
                      onClick={() => {
                        router.push(`/contract/${contract._id}`);
                      }}
                      className="flex items-center gap-4 py-4 px-8 w-full border-[1.5px] border-[#c6c6c8] rounded-[20px] text-[1.2rem] font-medium"
                    >
                      <QuickButton
                        bgc="rgba(96, 0, 255, 0.5)"
                        icon={<DocumentIcon />}
                      />
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col gap-[0.2rem] text-[#737373] text-[0.8rem] font-medium">
                          <span className="text-[1.2rem] text-black">
                            {contract.contractTitle}
                          </span>
                          <span className="text-[1rem]">
                            {contract.address ?? "미기재"}
                          </span>
                          <span>
                            {(contract.createdDate as string).split("T")[0]}{" "}
                            등록
                          </span>
                        </div>
                        <SubmitButton
                          width={4}
                          height={2}
                          fontSize={0.8}
                          fontWeight={500}
                          fontColor={contract.generated ? "#3c82f6" : "#eff6ff"}
                          borderRadius={"50px"}
                          background={
                            contract.generated ? "#eff6ff" : "#3c82f6"
                          }
                          borderColor={
                            contract.generated ? "#3c82f6" : "#eff6ff"
                          }
                        >
                          {contract.generated ? "생성됨" : "OCR"}
                        </SubmitButton>
                        {/* <SubmitButton
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
                         </SubmitButton> */}
                      </div>
                    </li>
                  );
                })
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
            </ul>
          </div>
          <div className="self-start w-full font-semibold text-[1.8rem] px-8 flex flex-col gap-4">
            최근 상담 내용
            <ul className="flex flex-col justify-center items-center gap-4">
              {chats.map(({ _id, chatTitle }) => (
                <li
                  key={_id}
                  className="flex py-4 justify-between items-center w-full border-[1.5px] border-[#c6c6c8] rounded-[20px] px-[1.5rem]"
                  onClick={() => router.push("/chatbot/" + _id)}
                >
                  <span className="flex items-center gap-4 text-[1.2rem] font-medium">
                    <ChatIcon color="#6000FF" />
                    {chatTitle}
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
