"use client";

import { useEffect } from "react";

function useSyncSessionStorage<T>(
  key: string,
  value: T,
  setValue: (val: T) => void,
  isObject = false
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem(key);

    if (
      (value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && !Array.isArray(value) && !value)) &&
      stored
    ) {
      // sessionStorage에 값이 있고 zustand에는 없으면 sessionStorage → zustand
      setValue(isObject ? JSON.parse(stored) : (stored as unknown as T));
    } else if (!stored && value !== null && value !== undefined) {
      // zustand에 값이 있고 sessionStorage에 없으면 zustand → sessionStorage
      sessionStorage.setItem(key, isObject ? JSON.stringify(value) : String(value));
    }
  }, [key, value, setValue, isObject]);
}

export default useSyncSessionStorage;
