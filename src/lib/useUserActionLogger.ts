"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "./logger";

export interface LogEntry {
  userId: string;
  userAgent: string;
  deviceType: "pc" | "mobile" | "tablet";
  width: number;
  height: number;
  page: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

// interface UseUserActionLoggerProps {
//   userId: string;
// }

// 디바이스 타입 판별
export function getDeviceType(): "pc" | "mobile" | "tablet" {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua))
    return "mobile";
  if (/ipad|tablet|android(?!.*mobile)/.test(ua)) return "tablet";
  return "pc";
}

// export function useUserActionLogger({ userId }: UseUserActionLoggerProps) {
export function useUserActionLogger() {
  const userId = "none";
  const page = usePathname();
  const userAgent = navigator.userAgent;
  const deviceType = getDeviceType();
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;

  const eventQueue = useRef<LogEntry[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);

  const flushQueue = useCallback(() => {
    if (eventQueue.current.length === 0) return;
    const batch = [...eventQueue.current];
    eventQueue.current = [];
    batch.forEach((e) => logEvent(e));
  }, []);

  useEffect(() => {
    flushTimer.current = setInterval(flushQueue, 1000);
    return () => {
      if (flushTimer.current) clearInterval(flushTimer.current);
    };
  }, [flushQueue]);

  const queueEvent = useCallback((event: LogEntry) => {
    eventQueue.current.push(event);
  }, []);

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
  }, [page, userId, userAgent, deviceType, width, height, queueEvent]);

  const pageEnterTime = useRef<number>(Date.now());

  useEffect(() => {
    const enterTime = pageEnterTime.current;
    return () => {
      const duration = Date.now() - enterTime;
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
  }, [page, userId, userAgent, deviceType, width, height, queueEvent]);

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
  }, [page, userId, userAgent, deviceType, width, height, queueEvent]);

  // --- keyboard ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Tab") return;

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
  }, [page, userId, userAgent, deviceType, width, height, queueEvent]);

  // --- scroll ---
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef<number>(0);
  const scrollStartTime = useRef<number | null>(null);

  useEffect(() => {
    function handleScroll() {
      if (!scrollStartTime.current) scrollStartTime.current = Date.now();
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const now = Date.now();
        const duration = now - (scrollStartTime.current ?? now);
        scrollStartTime.current = null;
        const scrollTop =
          typeof window !== "undefined"
            ? window.scrollY || window.pageYOffset
            : 0;

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

    document.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [page, userId, userAgent, deviceType, width, height, queueEvent]);

  // --- zoom ---
  const lastScale = useRef<number>(
    typeof window !== "undefined"
      ? window.visualViewport?.scale || window.devicePixelRatio
      : 1
  );

  useEffect(() => {
    const handleZoom = () => {
      const scale =
        typeof window !== "undefined"
          ? window.visualViewport?.scale || window.devicePixelRatio
          : 1;
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

    window.visualViewport?.addEventListener("resize", handleZoom);
    document.addEventListener("resize", handleZoom);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleZoom);
      document.removeEventListener("resize", handleZoom);
    };
  }, [page, userId, userAgent, deviceType, width, height, queueEvent]);
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
