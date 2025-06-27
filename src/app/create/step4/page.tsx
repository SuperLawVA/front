"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import StyledDiv from "@/components/StyledDiv";
import WarningIcon from "@/components/icons/Warning";
import MagicTwoStarIcon from "@/components/icons/MagicTwoStar";
import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlass";
import BulbIcon from "@/components/icons/Bulb";
import ExclamationIcon from "@/components/icons/Exclamation";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import DivBox from "@/components/DivBox";
import { useCreateStore } from "@/store/useStore";

function ContractCreateNewPage() {
  return (
    <>
      <div className="h-20 w-full flex flex-col justify-center items-center" />
      <BackHeader to="/">임대차 계약서 작성</BackHeader>
      <main className="flex flex-col items-center mt-[3rem] gap-12 h-[calc(100%-11rem)]">
        <div className="w-svw h-svh text-9xl wrap-break-word">
          제출 완료 및 생성 대기 페이지로 변경
        </div>
      </main>
    </>
  );
}

export default ContractCreateNewPage;
