// ✅ src/store/useStore.ts

import { createStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 기본 유저 정보
interface UserState {
  userName: string | null;
  notification: number[];
  contractArray:
    | {
        _id: string;
        title: string;
        state: string;
        address: string;
        contractDate: string;
        modifiedDate: string;
      }[];
  chats: { _id: string; sessionId: string; chatTitle: string }[];

  // // setters
  // setUser: (payload: Omit<UserState, "setUser" | "resetUser">) => void;
  // resetUser: () => void;
}

// type UserStoreActions = {
//   setUser: (payload: Omit<UserState, "setUser" | "resetUser">) => void;
//   setUser: (payload: UserState) => void;
//   clearUser: () => void;
//   getUser: () => UserState;
// };

// type UserStore = UserState & UserStoreActions;

export const useAuthStore = createStore<UserState>()(
  persist(
    // (set, get) => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set) => ({
      userName: null,
      notification: [],
      contractArray: [],
      chats: [],
      // setUser: (payload) => set(() => ({ ...payload })),
      // setUser: ({ userName, notification, contract, recentChat }) =>
      //   set(() => ({ userName, notification, contract, recentChat })),
      // clearUser: () =>
      //   set(() => ({
      //     userName: null,
      //     notification: [],
      //     contract: null,
      //     recentChat: [],
      //   })),
      // getUser: () => get(),
    }),
    {
      name: "userStore",
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// 계약서 작성
interface CreateState {
  contractId: string | null | "";
  articleAgree: string | null;
  contractTitle: string | null;
  contractType: "월세" | "전세" | null;
  dates: {
    contractDate: Date | "" | null;
  } | null;
  property: {
    address: string | null | "";
    detailAddress: string | null | "";
    building: {
      buildingConstructure: string | null | "";
      buildingType: string | null | "";
      buildingArea: number | null | "";
    } | null;
  } | null;
  payment: {
    deposit: number | null | "";
    downPayment: number | null | "";
    intermediatePayment: number | null | "";
    monthlyRent: number | null | "";
  } | null;
  legalBasis: {
    lawId: number;
    law: string;
    explanation: string;
    content: string;
  }[];
  caseBasis: {
    caseId: number;
    case: string;
    explanation: string;
    link: string;
  }[];
  userQuery: string[];
  agreements: {
    reason: string;
    suggestedRevision: string;
    negotiationPoints: string;
  }[];
  basicAgreements: { reason: string; suggestedRevision: string }[];
  articles: string[];
}

export const useCreateStore = createStore<CreateState>()(
  persist(
    // (set, get) => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set) => ({
      contractId: null,
      articleAgree: null,
      contractTitle: null,
      contractType: null,
      dates: null,
      property: null,
      payment: null,
      userQuery: [],
      legalBasis: [],
      caseBasis: [],
      agreements: [],
      basicAgreements: [],
      articles: [],
    }),
    {
      name: "createStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// 내용증명서 작성
interface CertificateState {
  ContractId: string | null;
  userQuery: string;
}

export const useCertificateStore = createStore<CertificateState>()(
  persist(
    // (set, get) => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set) => ({
      ContractId: null,
      userQuery: "",
    }),
    {
      name: "certificateStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
