"use client";

import React, { useRef, useEffect, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [onCamera, setOnCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  ); // ✅ 기본 후면 카메라

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (
          navigator.mediaDevices &&
          typeof navigator.mediaDevices.getUserMedia === "function"
        ) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }, // ✅ 현재 카메라 방향 사용
            audio: false,
          });
          streamRef.current = stream;

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [onCamera, facingMode]); // ✅ facingMode 변경 시도 재시작

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

  // ✅ 카메라 전환 버튼 핸들러
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
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

          {/* 사진 촬영 */}
          <button
            onClick={takePhoto}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/70 text-black rounded-full"
          >
            📸 사진 촬영
          </button>

          {/* 전/후면 카메라 전환 */}
          <button
            onClick={toggleCameraFacing}
            className="absolute top-5 left-5 px-4 py-2 bg-yellow-500 text-black rounded"
          >
            🔄 전/후면 전환
          </button>

          {/* 카메라 끄기 */}
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
