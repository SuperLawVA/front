"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import DocumentIcon from "@/components/icons/Document";
import InfoIcon from "@/components/icons/Info";
import { useAuthStore } from "@/store/useStore";
import Image from "next/image";
import clientApi from "@/lib/axios.client";
import ProfileIcon from "@/components/icons/Profile";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import PencilIcon from "@/components/icons/Pencil";
import axios from "axios";
import Modal from "@/components/Modal";

type Contract = {
  _id: string;
  contractTitle: string;
};

type Analysis = {
  _id: string;
  contractId: string;
  contractTitle: string;
};

type Certificate = {
  _id: string;
  title: string;
};

function MorePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  // const [notification, setNotification] = useState<number[]>([]);
  // const [contractArray, setContractArray] = useState<Contract[]>([]);
  const [activeContract, setActiveContract] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(false);
  const [docsArray, setDocsArray] = useState<
    [Contract[], Analysis[], Certificate[]] | null
  >(null);

  const handleLogout = async () => {
    await clientApi.get("/logout");
    useAuthStore.persist.clearStorage();
    sessionStorage.clear();
    sessionStorage.setItem("start", "true");
    router.replace("/login"); // 로그아웃 후 로그인 페이지로 이동
  };

  const getUserData = async () => {
    const response = await clientApi.post("/more", {});

    if (response) {
      const {
        userName,
        email,
        contractArray,
        analysisArray,
        certificateArray,
      } = response.data;

      setUserName(userName);
      setEmail(email);
      // setNotification(notification);
      setDocsArray([contractArray, analysisArray, certificateArray]);
    }
  };

  useEffect(() => {
    getUserData();
  }, [router]);

  const deleteContract = async (_id: string) => {
    try {
      await clientApi.post("/contract/delete", { _id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error) {
          console.log(error);
        }
      }
    }
  };
  const deleteAnalysis = async (_id: string) => {
    try {
      await clientApi.post("/analysis/delete", { _id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error) {
          console.log(error);
        }
      }
    }
  };
  const deleteCertificate = async (_id: string) => {
    try {
      await clientApi.post("/certificate/delete", { _id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error) {
          console.log(error);
        }
      }
    }
  };

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "contract" | "analysis" | "certificate" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const openDeleteModal = (
    type: "contract" | "analysis" | "certificate",
    id: string
  ) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
    });
  };
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      id: null,
    });
  };
  const handleDelete = async () => {
    if (!deleteModal.type || !deleteModal.id) return;

    try {
      if (deleteModal.type === "contract") {
        await deleteContract(deleteModal.id);
      } else if (deleteModal.type === "analysis") {
        await deleteAnalysis(deleteModal.id);
      } else if (deleteModal.type === "certificate") {
        await deleteCertificate(deleteModal.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeDeleteModal();
      getUserData();
    }
  };
  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <header className="w-full flex justify-center items-center h-24">
        <div className="w-full flex justify-between items-center p-8 mx-6 gap-4">
          <span className="flex gap-3">
            <Image
              width={9999}
              height={9999}
              src="logo.svg"
              className="w-12"
              alt=""
            />
            <span className="font-pretendard font-semibold text-[2rem] leading-[120%] tracking-[-0.04em] bg-gradient-to-r from-[#6000FF] to-[#E100FF] bg-clip-text text-transparent">
              Super LawVA
            </span>
          </span>
          <span className="flex gap-[2.4rem] text-main" onClick={handleLogout}>
            로그아웃
          </span>
        </div>
      </header>
      <main className="w-full flex flex-col items-center min-h-[calc(100%-18rem)]">
        <div className="w-full p-8">
          <div className="w-full py-6 px-8 flex gap-12 items-center bg-white border border-[#c6c6c8] rounded-[20px]">
            <ProfileIcon width={2.5} height={2.5} color="#9CA3AF" />
            <div>
              <div className="text-[2rem] font-semibold">{userName}</div>
              <div className="text-[1.2rem] text-[#9ca3af] font-medium">
                {email}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex-1 mt-4 px-8 py-10 gap-12 rounded-[20px][50px] bg-white flex flex-col items-center">
          <div className="text-[2rem] self-start font-semibold">내 문서함</div>
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <ul
              className={`w-full h-full px-8 py-6 gap-4 flex flex-col justify-center border border-[#c6c6c8]${
                activeContract ? "" : " rounded-[20px]"
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <div
                  onClick={() => setActiveContract(!activeContract)}
                  className="w-full flex items-center gap-4 font-medium text-[1.4rem] text-black/60"
                >
                  <DocumentIcon color="#32d74b" width={1.6} height={1.6} />
                  계약서 초안
                </div>
                <ArrowDownIcon
                  width={1.6}
                  color="#9CA3AF"
                  to="#"
                  className="pointer-events-none"
                />
              </div>
              {activeContract && (
                <hr className="w-full border border-[#d9d9d9]" />
              )}
              {activeContract &&
                docsArray &&
                docsArray[0].map(({ _id, contractTitle }) => {
                  return (
                    <li key={_id} className="w-full flex flex-col">
                      <div className="w-full flex justify-between text-[1.2rem] px-4">
                        <span
                          onClick={() => router.push("/contract/" + _id)}
                          className="self-start"
                        >
                          {contractTitle}
                        </span>
                        <div className="flex gap-8 justify-center">
                          <span className="text-[#FF9500]">편집</span>
                          <span
                            className="text-red-600"
                            onClick={() => openDeleteModal("contract", _id)}
                          >
                            삭제
                          </span>
                        </div>
                      </div>
                      <hr className="w-full border-[0.5px] border-[#d9d9d9]" />
                    </li>
                  );
                })}
            </ul>
            <ul
              className={`w-full h-full px-8 py-6 gap-4 flex flex-col justify-center border border-[#c6c6c8]${
                activeAnalysis ? "" : " rounded-[20px]"
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <div
                  onClick={() => setActiveAnalysis(!activeAnalysis)}
                  className="w-full flex items-center gap-4 font-medium text-[1.4rem] text-black/60"
                >
                  <PencilIcon color="#0A84FF" width={1.6} height={1.6} />
                  계약서 분석 결과
                </div>
                <ArrowDownIcon
                  width={1.6}
                  color="#9CA3AF"
                  to="#"
                  className="pointer-events-none"
                />
              </div>
              {activeAnalysis && (
                <hr className="w-full border border-[#d9d9d9]" />
              )}
              {activeAnalysis &&
                docsArray &&
                docsArray[1].map(({ _id, contractTitle }) => {
                  return (
                    <li key={_id} className="w-full flex flex-col">
                      <div className="w-full flex justify-between text-[1.2rem] px-4">
                        <span
                          onClick={() => router.push("/analysis/" + _id)}
                          className="self-start"
                        >
                          {contractTitle}의 분석 결과
                        </span>
                        <div className="flex gap-8 justify-center">
                          <span className="text-[#FF9500]">편집</span>
                          <span
                            className="text-red-600"
                            onClick={() => openDeleteModal("analysis", _id)}
                          >
                            삭제
                          </span>
                        </div>
                      </div>
                      <hr className="w-full border-[0.5px] border-[#d9d9d9]" />
                    </li>
                  );
                })}
            </ul>
            <ul
              className={`w-full h-full px-8 py-6 gap-4 flex flex-col justify-center border border-[#c6c6c8]${
                activeCertificate ? "" : " rounded-[20px]"
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <div
                  onClick={() => setActiveCertificate(!activeCertificate)}
                  className="w-full flex items-center gap-4 font-medium text-[1.4rem] text-black/60"
                >
                  <InfoIcon color="#FF453A" width={1.6} height={1.6} />
                  생성된 내용증명서
                </div>
                <ArrowDownIcon
                  width={1.6}
                  color="#9CA3AF"
                  to="#"
                  className="pointer-events-none"
                />
              </div>
              {activeCertificate && (
                <hr className="w-full border border-[#d9d9d9]" />
              )}
              {activeCertificate &&
                docsArray &&
                docsArray[2].map(({ _id, title }) => {
                  return (
                    <li key={_id} className="w-full flex flex-col">
                      <div className="w-full flex justify-between text-[1.2rem] px-4">
                        <span
                          onClick={() =>
                            router.push("/certificate/result/" + _id)
                          }
                          className="self-start"
                        >
                          {title}
                        </span>
                        <div className="flex gap-8 justify-center">
                          <span className="text-[#FF9500]">편집</span>
                          <span
                            className="text-red-600"
                            onClick={() => openDeleteModal("certificate", _id)}
                          >
                            삭제
                          </span>
                        </div>
                      </div>
                      <hr className="w-full border-[0.5px] border-[#d9d9d9]" />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </main>
      <Modal
        isOpen={deleteModal.isOpen}
        setIsOpen={closeDeleteModal}
        clickOutsideClose={true}
        isCenter={true}
      >
        <div className="w-[90%] mx-[5%] flex flex-col gap-4 items-center justify-center p-12 bg-white rounded-[30px]">
          <div className="text-[1.8rem]">정말로 삭제하시겠습니까?</div>
          <div className="text-[1.4rem]">
            계약서를 삭제하면 연결된 분석 결과도 함께 삭제됩니다.
          </div>
          <div className="flex gap-12 mt-4 text-[1.4rem]">
            <button
              onClick={closeDeleteModal}
              className="px-8 py-4 bg-main rounded-[20px] text-white"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              className="px-8 py-4 bg-subText text-white rounded-[20px]"
            >
              삭제
            </button>
          </div>
        </div>
      </Modal>
      <BottomNav />
      {/* <BottomNav mainBackGroundColor="rgb(245, 244, 248)" /> */}
    </>
  );
}

export default MorePage;
