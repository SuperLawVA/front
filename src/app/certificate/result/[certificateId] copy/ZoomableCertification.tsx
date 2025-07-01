"use client";

import React, { useRef, useState, useEffect } from "react";

export type CertificationProps = {
  title?: string;
  receiver?: {
    name?: string;
    address?: string;
    detailAddress?: string;
  };
  sender?: {
    name?: string;
    address?: string;
    detailAddress?: string;
  };
  body?: string;
  createdDate?: string;
};

export default function ZoomableCertification(props: {
  data?: CertificationProps;
}) {
  const { data = {} } = props;
  const {
    title = "제목 없음",
    receiver = {},
    sender = {},
    body = "",
    createdDate,
  } = data;

  const [isFullScreen, setIsFullScreen] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "날짜 없음";
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!isFullScreen) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isFullScreen || !isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (isFullScreen) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isFullScreen]);

  return (
    <div
      ref={containerRef}
      className={`border bg-white text-black cursor-pointer ${
        isFullScreen
          ? "fixed top-0 left-0 w-screen z-50 flex justify-center bg-gray-800 bg-opacity-80"
          : ""
      }`}
      onMouseDown={onMouseDown}
      style={
        isFullScreen
          ? {
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "center center",
            }
          : {}
      }
    >
      <div className={`p-8 ${isFullScreen ? "max-w-[800px]" : ""}`}>
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

        <div className="mb-4">
          <h2 className="font-semibold">발신인</h2>
          <p>이름: {sender.name ?? "미상"}</p>
          <p>
            주소: {sender.address ?? "미상"}{" "}
            {sender.detailAddress && `(${sender.detailAddress})`}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold">수신인</h2>
          <p>이름: {receiver.name ?? "미상"}</p>
          <p>
            주소: {receiver.address ?? "미상"}{" "}
            {receiver.detailAddress && `(${receiver.detailAddress})`}
          </p>
        </div>

        <div className="whitespace-pre-wrap border-t border-b py-4 mb-4">
          {body || "본문 내용이 없습니다."}
        </div>

        <div className="text-right mt-8">
          <p>{formatDate(createdDate)}</p>
          <p>발신인: {sender.name ?? "미상"} (인)</p>
        </div>
      </div>
    </div>
  );
}
