import { create } from "zustand";

interface Contract {
  title: string;
  state: string;
  address: string;
  createdAt: string;
}

interface RecentChat {
  _id: string;
  title: string;
}
[];

interface AuthState {
  // token: string | null;
  message: string;
  userName: string;
  notification: number[];
  contract: Contract | null;
  recentChat: RecentChat | null;

  // setToken: (token: string | null) => void;
  setMessage: (msg: string) => void;
  setUserName: (name: string) => void;
  setNotification: (noti: number[]) => void;
  setContract: (contract: Contract | null) => void;
  setRecentChat: (recentChat: RecentChat | null) => void;

  // get 메서드 추가 (상태 전부 가져오기 용)
  getStatus: () => {
    // token: string | null;
    message: string;
    userName: string;
    notification: number[];
    contract: Contract | null;
    recentChat: RecentChat | null;
  };
}

const useAuthStore = create<AuthState>((set, get) => ({
  // token: null,
  message: "",
  userName: "",
  notification: [],
  contract: null,
  recentChat: null,

  // setToken: (token) => set({ token }),
  setMessage: (msg) => set({ message: msg }),
  setUserName: (name) => set({ userName: name }),
  setNotification: (noti) => set({ notification: noti }),
  setContract: (contract) => set({ contract }),
  setRecentChat: (recentChat) => set({ recentChat }),

  getStatus: () => get(),
}));

export default useAuthStore;
