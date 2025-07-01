// page.tsx
"use client";

import CheckedIcon from "@/components/icons/Checked";
import DocumentIcon from "@/components/icons/Document";
import Modal from "@/components/Modal";
import StyledDiv from "@/components/StyledDiv";
import StyledInput from "@/components/StyledInput";
import SubmitButton from "@/components/SubmitButton";
import { useAuthStore, useCreateStore } from "@/store/useStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

function CreatePage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [titleValid, setTitleValid] = useState(true);
  const [contractTitle, setContractTitle] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  // const handleSelect = (index: number) => {
  //   setSelected((prev) => (prev === index ? null : index));
  // };

  const handleBarSwipe = useSwipeable({
    onSwipedDown: () => setModalOpen(false),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleSelect = (index: number) => {
    const contractType = Boolean(index) ? "월세" : "전세";
    const setTitle = contractTitle
      ? contractTitle.trim() + " 계약서"
      : contractType + " 임대차 계약서";
    setSelected(index);
    useCreateStore.setState({
      contractTitle: setTitle,
      contractType,
    });
    setTimeout(() => {
      router.push("create/step1");
    }, 300);
  };
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    const { userName } = useAuthStore.getState();
    setUserName(userName as string);
  }, []);

  return (
    <>
      <main className="flex flex-col items-center h-full bg-white">
        <div className="h-52 w-full" />
        <StyledDiv
          width={15.2}
          height={3.4}
          background="rgba(50, 215, 75, 0.2)"
          fontSize={1.2}
          fontColor="#32d74b"
          fontWeight={700}
          borderColor="none "
          icon={<DocumentIcon width={1.4} height={1.4} color="#32d74b" />}
        >
          AI로 계약서 관리하기
        </StyledDiv>
        <div className="mt-8 text-center text-[2.6rem]/[3.1rem] font-bold">
          {userName}&nbsp;님의 계약을
          <br />
          도와드릴게요!
        </div>
        <Image
          width={99999}
          height={99999}
          src="/createStart.png"
          alt="Main Icon"
          className="w-[26.5rem] h-[26.5rem] mt-16"
        />
        <div className="mt-16 text-center text-[1.2rem] font-medium">
          당신의 계약서는 안전해야 하니까.
          <br />
          AI가 당신의 계약을 도와드릴게요
        </div>
        <SubmitButton
          width={26}
          height={5.5}
          fontSize={1.8}
          className="mt-16"
          onClick={() => setModalOpen(true)}
        >
          시작하기
        </SubmitButton>
        <div
          onClick={() => router.back()}
          className="mt-8 text-[#797979] text-[1.4rem] font-medium"
        >
          ← 다음에 할래요
        </div>
      </main>
      <Modal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        clickOutsideClose={true}
        onClickOutside={() => {
          if (titleValid) {
            setModalOpen(false);
          } else {
            setModalOpen(true);
            setTitleValid(true);
          }
        }}
      >
        <div
          {...handleBarSwipe}
          className="mx-auto mt-6 w-20 h-1.5 rounded-full bg-gray-300"
        />
        {titleValid ? (
          <div className="my-10 flex flex-col gap-12">
            <div className="flex flex-col justify-center items-center text-[2rem] font-bold">
              계약서 제목을 정해주세요.
              <span className="text-[1.4rem] font-medium">
                기재하신 제목의 뒤에 자동으로 &quot; 계약서&quot; 가 붙습니다.
              </span>
            </div>
            <StyledInput
              placeholder="ex) 중구 8평 원룸"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
            />
            <div className="flex flex-col justify-center items-center gap-4">
              <SubmitButton
                type="button"
                fontSize={1.8}
                height="100%"
                className="flex justify-center items-center py-4"
                onClick={() => setTitleValid(false)}
              >
                제출
              </SubmitButton>
              <span className="text-[1.2rem] text-main font-medium">
                미기재 시 제목 자동 생성
              </span>
            </div>
          </div>
        ) : (
          <div className="my-10 flex flex-col gap-12">
            <div className="text-[2rem] font-bold text-center">
              추가할 부동산은 무엇인가요?
            </div>
            <ul className="flex flex-col gap-6 px-4 text-[1.8rem] font-medium">
              {["전세", "반전세, 월세"].map((option, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => handleSelect(index)}
                    className="flex gap-4 items-center justify-between text-[#4e4e4e]"
                  >
                    <span
                      className={
                        selected === index ? "text-[#6000FF]" : "text-[#4e4e4e]"
                      }
                      style={{ transition: "color 0.3s" }}
                    >
                      {option}
                    </span>
                    <CheckedIcon
                      width={1.4}
                      height={1.4}
                      color={selected === index ? "#6000FF" : "#c4c4c5"}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
}

export default CreatePage;
