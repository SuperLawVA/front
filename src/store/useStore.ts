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
  recentChat: { _id: string; title: string }[];

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
      recentChat: [],
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
  articleAgree: string | null;
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
  articles: string[];
  userQuery: string[];
}

export const useCreateStore = createStore<CreateState>()(
  persist(
    // (set, get) => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set) => ({
      articleAgree: null,
      contractType: null,
      dates: null,
      property: null,
      payment: null,
      userQuery: [],
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
