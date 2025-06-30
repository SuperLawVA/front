// page.tsx
"use client";

import { useSwipeable } from "react-swipeable";
import CameraIcon from "@/components/icons/Camera";
import MagicThreeStarIcon from "@/components/icons/MagicThreeStar";
import PictureIcon from "@/components/icons/Picture";
import Modal from "@/components/Modal";
import StyledDiv from "@/components/StyledDiv";
import SubmitButton from "@/components/SubmitButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CameraPage from "./Camera";
import UploadImagePage from "./UploadImages";
import GreenLogoIcon from "@/components/icons/GreenLogo";
import LoadingPage from "./Loading";

function UploadPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isCenter, setIsCenter] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleBarSwipe = useSwipeable({
    onSwipedDown: () => {
      // step별로 동작 분기!
      if (step === 11 || step === 12) {
        // 업로드/카메라에서 아래로 스와이프 → 뒤로가기(첫 화면으로)
        setStep(0);
        setIsCenter(false);
      } else if (step === 0) {
        // 첫화면에서 스와이프 → 모달 닫기
        setModalOpen(false);
      } else if (step === 2) {
        // 완료 화면에선 모달 닫기 or 홈 이동 등 자유롭게
        setModalOpen(false);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (!modalOpen && step === 2) {
      router.push("/");
    }
  }, [modalOpen]);
  useEffect(() => {
    if (isLoading) setModalOpen(false);
  }, [isLoading]);

  return (
    <>
      <main className="flex flex-col items-center h-full bg-white">
        <div className="h-52 w-full" />
        <StyledDiv
          width={15.2}
          height={3.4}
          background="#faf5ff"
          fontSize={1.2}
          fontWeight={700}
          icon={<MagicThreeStarIcon width={1.6} height={2} />}
        >
          <span className="text-good">AI로 계약서 관리하기</span>
        </StyledDiv>
        <div className="mt-8 text-center text-[2.6rem]/[3.1rem] font-bold">
          아무개 님의 문서는
          <br />
          소중하니까
        </div>
        <Image
          width={99999}
          height={99999}
          src="/uploadPage.png"
          alt="Main Icon"
          className="w-[26.5rem] h-[26.5rem] mt-16"
        />
        <div className="mt-16 text-center text-[1.2rem] font-medium">
          당신의 계약서는 안전해야 하니까.
          <br />
          AI가 당신의 계약서를 관리해 드릴게요
        </div>
        <SubmitButton
          width={26}
          height={5.5}
          fontSize={1.8}
          className="mt-16"
          onClick={() => setModalOpen(true)}
        >
          업로드 하기
        </SubmitButton>
        <button
          onClick={() => router.back()}
          className="mt-8 text-[#797979] !text-[1.4rem] font-medium"
        >
          ← 다음에 할래요
        </button>
      </main>

      {/* 1번 모달 */}
      <Modal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        isCenter={isCenter}
        isFull={isCenter}
        clickOutsideClose={true}
        onClickOutside={() => {
          if (step > 10) {
            setModalOpen(true);
            setIsCenter(false);
            setStep(0);
          } else {
            setModalOpen(false);
          }
        }}
      >
        <div
          {...handleBarSwipe}
          className="mx-auto mt-6 w-20 h-1.5 rounded-full bg-gray-300"
        />
        {step === 0 && (
          <div className="my-16 flex flex-col gap-8">
            <div className="text-[2rem] font-bold text-center">
              어떤 방식으로 업로드하시겠어요?
            </div>
            <ul className="flex flex-col gap-6 px-4 text-[1.8rem] text-[#4e4e4e] font-medium justar">
              <li
                className="flex gap-4 items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setStep(11);
                }}
              >
                <PictureIcon />
                <span>사진으로 업로드</span>
              </li>
              <li
                className="flex gap-4 items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCenter(true);
                  setStep(12);
                }}
              >
                <CameraIcon />
                <span>카메라로 업로드</span>
              </li>
            </ul>
          </div>
        )}
        {step === 11 && (
          <UploadImagePage
            setPageOpen={() => {
              setStep(2);
            }}
            setIsLoading={setIsLoading}
          />
        )}
        {step === 12 && (
          <CameraPage
            goBack={() => {
              setModalOpen(true);
              setIsCenter(false);
              setStep(0);
            }}
            goNext={() => {
              setStep(2);
              setModalOpen(true);
              setIsCenter(false);
            }}
            setIsLoading={setIsLoading}
          />
        )}
        {step === 2 && (
          <div className="w-full p-16 flex flex-col gap-8">
            <div className="text-[2rem] font-bold text-center">
              계약서 업로드가 완료되었습니다!
            </div>
            <div className="flex justify-center items-center">
              <GreenLogoIcon width={8} height={8} color="#32d74b" />
            </div>
            <div className="flex w-full gap-8 justify-between">
              <SubmitButton
                width={16}
                height={5}
                fontSize={1.6}
                fontWeight={500}
                fontColor="#1e1e1e"
                background="white"
                borderColor="#5c5c5c"
                onClick={() => {
                  sessionStorage.removeItem("contractId");
                  router.push("/");
                }}
              >
                홈 화면으로
              </SubmitButton>
              <SubmitButton
                width={16}
                height={5}
                fontSize={1.6}
                fontWeight={500}
                onClick={() => {
                  const contractId = sessionStorage.getItem("contractId");
                  sessionStorage.removeItem("contractId");
                  router.push("/contract/" + contractId);
                }}
              >
                계약서 확인
              </SubmitButton>
            </div>
          </div>
        )}
      </Modal>
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <LoadingPage />
          {/* <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div> */}
        </div>
      )}
    </>
  );
}

export default UploadPage;
