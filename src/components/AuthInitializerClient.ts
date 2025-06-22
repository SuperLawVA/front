"use client";

import useAuthStore from "@/store/useAuthStore";
import useSyncSessionStorage from "@/hooks/useSyncSessionStorage";

export function AuthInitializerClient() {
  const {
    message,
    userName,
    notification,
    contract,
    recentChat,
    setMessage,
    setUserName,
    setNotification,
    setContract,
    setRecentChat,
  } = useAuthStore();

  useSyncSessionStorage("message", message, setMessage);
  useSyncSessionStorage("userName", userName, setUserName);
  useSyncSessionStorage("notification", notification, setNotification, true);
  useSyncSessionStorage("contract", contract, setContract, true);
  useSyncSessionStorage("recentChat", recentChat, setRecentChat, true);

  return null;
}
