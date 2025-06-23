"use client";

import React, { useRef, useEffect, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // stream 저장용 useRef (컴포넌트 라이프사이클 동안 유지)
  const streamRef = useRef<MediaStream | null>(null);

  const [onCamera, setOnCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (
          navigator.mediaDevices &&
          typeof navigator.mediaDevices.getUserMedia === "function"
        ) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          streamRef.current = stream; // useRef에 저장

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          alert(
            "이 브라우저나 시크릿 모드에서는 카메라 기능을 지원하지 않습니다."
          );
        }
      } catch (err) {
        console.error("Camera access error:", err);
        alert("카메라 접근 중 오류가 발생했습니다.");
      }
    };

    if (onCamera) {
      startCamera();
    }

    return () => {
      // 컴포넌트 언마운트 또는 onCamera false 시 카메라 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      // video srcObject 해제
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [onCamera]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 카메라 시작/종료 버튼 */}
      <div className="p-4">
        <button
          onClick={() => setOnCamera((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {onCamera ? "카메라 끄기" : "카메라 켜기"}
        </button>
      </div>

      {/* 촬영한 이미지 */}
      {capturedImage && (
        <div className="p-4">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-md rounded border"
          />
        </div>
      )}

      {/* 숨김 canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* 카메라 전체화면 & 버튼 오버레이 */}
      {onCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          <button
            onClick={takePhoto}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/70 text-black rounded-full"
          >
            📸 사진 촬영
          </button>

          <button
            onClick={() => setOnCamera(false)}
            className="absolute top-5 right-5 px-4 py-2 bg-red-600 text-white rounded"
          >
            ✖ 종료
          </button>
        </div>
      )}
    </div>
  );
}
