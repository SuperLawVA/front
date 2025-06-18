// lib/useUserActionLogger.ts

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "./logger";

interface UseUserActionLoggerProps {
  userId: string;
}

// 디바이스 타입 판별
export function getDeviceType(): "pc" | "mobile" | "tablet" {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua))
    return "mobile";
  if (/ipad|tablet|android(?!.*mobile)/.test(ua)) return "tablet";
  return "pc";
}

export function useUserActionLogger({ userId }: UseUserActionLoggerProps) {
  const page = usePathname();
  const userAgent = navigator.userAgent;
  const deviceType = getDeviceType();
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 🔑 👉 로컬 큐: 여러 이벤트를 모아뒀다가 한번에 전송
  const eventQueue = useRef<any[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);

  // 🔑 👉 flush 함수: 큐를 서버로 전송 후 비움
  const flushQueue = () => {
    if (eventQueue.current.length === 0) return;
    const batch = [...eventQueue.current];
    eventQueue.current = [];
    // 원래 logEvent를 바로 호출했다면, 이제는 batch로 전송하도록 logger에서 지원 필요
    batch.forEach((e) => logEvent(e));
  };

  // 🔑 👉 일정 주기로 자동 flush (1초마다)
  useEffect(() => {
    flushTimer.current = setInterval(flushQueue, 1000);
    return () => {
      if (flushTimer.current) clearInterval(flushTimer.current);
    };
  }, []);

  // --- 기록 대신 큐에 추가 ---
  const queueEvent = (event: any) => {
    eventQueue.current.push(event);
  };

  // --- page load ---
  useEffect(() => {
    const navTiming = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    let loadTime = 0;
    if (navTiming) {
      loadTime = navTiming.loadEventEnd - navTiming.loadEventStart;
    } else if (performance.timing) {
      const timing = performance.timing;
      loadTime = timing.loadEventEnd - timing.loadEventStart;
    }

    queueEvent({
      userId,
      userAgent,
      deviceType,
      width,
      height,
      page,
      type: "page_load",
      timestamp: new Date().toISOString(),
      data: { loadTime },
    });
  }, [page, userId]);

  useEffect(() => {
    return () => {
      const duration = Date.now() - pageEnterTime.current;
      queueEvent({
        userId,
        userAgent,
        deviceType,
        width,
        height,
        page,
        type: "page_stay",
        timestamp: new Date().toISOString(),
        data: { durationMs: duration },
      });
    };
  }, [page, userId]);

  // --- click & touch ---
  useEffect(() => {
    function handlePointerEvent(e: MouseEvent | TouchEvent) {
      const target = e.target as HTMLElement;
      const tagPath = getElementPath(target),
        tagName = target.tagName || null,
        tagId = target.id || null,
        tagClass = target.className || null,
        tagAttrName = target.getAttribute("name");
      let x = 0,
        y = 0,
        type = "click";

      if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else if (e instanceof TouchEvent) {
        if (e.type === "touchstart" && e.touches.length > 0) {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
          type = "touchStart";
        } else if (e.type === "touchend" && e.changedTouches.length > 0) {
          x = e.changedTouches[0].clientX;
          y = e.changedTouches[0].clientY;
          type = "touchEnd";
        }
      }

      queueEvent({
        userId,
        userAgent,
        deviceType,
        width,
        height,
        page,
        type,
        timestamp: new Date().toISOString(),
        data: {
          x,
          y,
          tagPath,
          tagName,
          tagId,
          tagClass,
          tagAttrName,
        },
      });
    }

    document.addEventListener("click", handlePointerEvent);
    document.addEventListener("touchstart", handlePointerEvent);
    document.addEventListener("touchend", handlePointerEvent);

    return () => {
      document.removeEventListener("click", handlePointerEvent);
      document.removeEventListener("touchstart", handlePointerEvent);
      document.removeEventListener("touchend", handlePointerEvent);
    };
  }, [page, userId]);

  // --- keyboard ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Tab") return; // Enter, Space만 로깅

      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("submit")
      ) {
        const tagPath = getElementPath(target),
          tagName = target.tagName || null,
          tagId = target.id || null,
          tagClass = target.className || null,
          tagAttrName = target.getAttribute("name");

        queueEvent({
          userId,
          userAgent,
          deviceType,
          width,
          height,
          page,
          type: "button_action",
          timestamp: new Date().toISOString(),
          data: {
            text: target.textContent?.trim(),
            tagPath,
            tagName,
            tagId,
            tagClass,
            tagAttrName,
          },
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [page, userId]);

  // --- scroll ---
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef<number>(0);
  const scrollStartTime = useRef<number | null>(null);
  const pageEnterTime = useRef<number>(Date.now());

  useEffect(() => {
    function handleScroll() {
      if (!scrollStartTime.current) scrollStartTime.current = Date.now();
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const now = Date.now();
        const duration = now - (scrollStartTime.current ?? now);
        scrollStartTime.current = null;
        const scrollTop = window.scrollY || window.pageYOffset;
        queueEvent({
          userId,
          userAgent,
          deviceType,
          width,
          height,
          page,
          type: "scroll",
          timestamp: new Date().toISOString(),
          data: {
            scrollTop,
            scrollDelta: scrollTop - lastScrollTop.current,
            durationMs: duration,
          },
        });
        lastScrollTop.current = scrollTop;
      }, 500);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, userId]);

  // --- zoom ---
  const lastScale = useRef<number>(
    window.visualViewport?.scale || window.devicePixelRatio || 1
  );

  useEffect(() => {
    const handleZoom = () => {
      const scale =
        window.visualViewport?.scale || window.devicePixelRatio || 1;

      // 변화량이 의미있을 때만 로깅
      if (Math.abs(scale - lastScale.current) > 0.01) {
        queueEvent({
          userId,
          userAgent,
          deviceType,
          width,
          height,
          page,
          type: "zoom",
          timestamp: new Date().toISOString(),
          data: {
            scale,
            devicePixelRatio: window.devicePixelRatio,
          },
        });
        lastScale.current = scale;
      }
    };

    // 모바일 & 데스크탑 대응
    window.visualViewport?.addEventListener("resize", handleZoom);
    window.addEventListener("resize", handleZoom);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleZoom);
      window.removeEventListener("resize", handleZoom);
    };
  }, [queueEvent]);
}

// tag 고유 경로 생성
function getElementPath(el: HTMLElement | null): string {
  if (!el) return "";
  let path = "";
  while (el) {
    let tag = el.tagName.toLowerCase();
    if (el.id) tag += `#${el.id}`;
    if (el.className && typeof el.className === "string")
      tag += `.${el.className.split(" ").join(".")}`;
    path = tag + (path ? " > " + path : "");
    el = el.parentElement;
  }
  return path;
}
