"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import StyledDiv from "@/components/StyledDiv";
import WarningIcon from "@/components/icons/Warning";
import CheckedIcon from "@/components/icons/Checked";
import { useCreateStore } from "@/store/useStore";

function ContractCreateNewPage() {
  // const searchParams = useSearchParams();
  // const contractTypeQuery = searchParams.get("rent");
  const [articles, setArticles] = useState<string[]>([]);
  const [contractTitle, setContractTitle] = useState("");

  const router = useRouter();
  useEffect(() => {
    const { contractType, articleAgree, contractTitle } =
      useCreateStore.getState();
    if (!contractType) {
      router.replace("/create");
    } else if (!articleAgree) {
      router.replace("step2");
    }
    setContractTitle(contractTitle as string);
    if (contractType === "전세" || contractType === "월세") {
      setArticles([
        "제1조 (목적)\n위 부동산의 임대차에 한하여 임대인과 임차인은 합의에 의하여 임차보증금 및 차임을 아래와 같이 지불하기로 한다.",
        "제2조 (존속기간)\n임대인은 위 부동산을 임대차 목적대로 사용 수익할 수 있는 상태로 하여 '''2025년 10월 31일'''까지 임차인에게 인도하며, 임대차기간은 인도일로부터 '''24''' 개월인 '''2027년 10월 31일'''까지로 한다.",
        "제3조 (용도변경 및 전대 등)\n임차인은 임대인의 동의 없이 위 부동산의 용도나 구조를 변경하거나 전대, 임차권 양도 또는 담보제공을 하지 못하며 임대차 목적 이외의 용도로 사용할 수 없다.",
        "제4조 (계약의 해지)\n임차인이 3기의 차임액에 달하도록 연체하거나 제 3조를 위반하였을 때 임대인은 즉시 본 계약을 해지할 수 있다.",
        "제5조 (계약의 종료)\n임대차계약이 종료된 경우에 임차인은 위 부동산을 원상으로 회복하여 임대인에게 반환하다. 이러한 경우 임대인은 보증금을 임차인에게 반환하고, 연체 임대료 또는 손해배상금이 있을 때는 이들을 제하고 그 잔액을 반환한다.",
        "제6조 (계약의 해제)\n임차인이 임대인에게 중도금(중도금이 없을 때는 잔금)을 지불하기 전까지, 임대인은 계약금의 배액을 상환하고, 임차인은 계약금을 포기하고 이 계약을 해제할 수 있다.",
        "제7조 (채무불이행과 손해배상)\n임대인 또는 임차인이 본 게약상의 내용에 대하여 불이행이 있을 경우 그 상대방은 불이행한 자에 대하여 서면으로 최고하고 계약을 해제할 수 있다. 그리고 계약 당사자는 계약해제에 따른 손해배상을 각각 상대방에 대하여 청구할 수 있으며, 손해배상에 대하여 별도의 약정이 없는 한 계약금을 손해배상의 기준으로 본다.",
        "제8조 (중개보수)\n개업공인중개사는 계약 당사자의 본 계약 불이행에 대하여 책임지지 않으며, 개업공인중개사의 고의나 과실없이 본 게약이 무효, 취소, 해제 되어도 중개보수는 지급한다. 중개보수는 본 계약 체결시에 계약 당사자 쌍방이 각각 지불하되, 확인설명서에 별도의 지급일이 있으면 그에 따른다. 공동중개인 경우 게약 당사자는 자신이 중개의뢰한 개업공인중개사에게 각각 중개보수를 지급한다.",
        "제9조 (중개대상물확인.설명서 교부 등)\n개업공인중개사는 중개대상물 확인.설명서를 작성하고 업무보증관계증서(공제증서 등) 사본을 첨부하여 '''계약일 당일```까지 거래당사자 쌍방에게 교부한다.",
      ]);
    }
  }, [router]);

  const { dates, payment } = useCreateStore.getState();

  function formatDate(date: Date | string | null | undefined) {
    if (!date || date === "") return null;
    const d = new Date(date as string);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  function formatNumber(val: number | string | null | undefined) {
    if (!val || val === "") return null;
    return Number(val).toLocaleString() + "원";
  }

  const [disable, setDisable] = useState(true);

  return (
    <>
      <div className="h-20 mt-15 w-full flex flex-col justify-center items-center" />
      {contractTitle && <BackHeader>{contractTitle + " 작성"}</BackHeader>}
      <main className="flex flex-col items-center mt-[2rem] gap-12 h-auto">
        <StyledDiv
          width="calc(100% - 4rem)"
          height={4.5}
          background="#fefce8"
          borderColor="#fef9c3"
          className="flex items-center px-4 mx-90"
          icon={
            <div className="w-12 h-12 bg-yellow rounded-full flex justify-center items-center">
              <WarningIcon color="#FFE32E" />
            </div>
          }
        >
          <div className="flex flex-col justify-center text-[1.2rem] font-semibold text-black">
            경고
            <span className="text-[1rem] font-medium text-[#9ca3af]">
              본 조항은 기본 조항입니다. 계약 전에 전문가와 상담을 추천합니다.
            </span>
          </div>
        </StyledDiv>
        <div className="flex flex-col justify-center items-center w-full gap-4 text-[1.6rem] font-semibold ">
          3. 계약 조항
          <ul className="px-10 py-12 w-full bg-white rounded-[50px] flex flex-col gap-6 justify-center text-[1.2rem] font-medium">
            {articles.map((v, i) => {
              return (
                <li key={i}>
                  {v.split("\n")[0].trim()}
                  <div className="font-normal">{v.split("\n")[1].trim()}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full px-12 flex flex-col gap-8">
          <span
            className={`flex self-center justify-self-center gap-4${
              disable ? " text-[rgba(128,128,128,0.55)]" : " text-main"
            }`}
            onClick={() => setDisable(!disable)}
          >
            <CheckedIcon
              color={disable ? "rgba(128, 128, 128, 0.55)" : "#6000ff"}
            />
            모든 내용을 확인했습니다
          </span>
          <SubmitButton
            width="100%"
            height={5.5}
            fontSize={1.8}
            fontWeight={500}
            disabled={disable}
            className="mb-12"
            onClick={() => {
              useCreateStore.setState({ articleAgree: "true", articles });
              router.push("step3");
            }}
          >
            다음
          </SubmitButton>
        </div>
      </main>
    </>
  );
}

export default ContractCreateNewPage;
