"use client";

import axios from "axios";
import React, { useRef, useEffect, useState } from "react";

interface UploadPageProps {
  goBack: () => void; // 부모에서 상태 관리용 함수
  goNext: () => void; // 부모에서 상태 관리용 함수
}

export default function CameraPage({ goBack, goNext }: UploadPageProps) {
  // 비디오 요소 참조
  const videoRef = useRef<HTMLVideoElement>(null);
  // 캔버스 요소 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 현재 연결된 MediaStream 저장
  const streamRef = useRef<MediaStream | null>(null);

  // 촬영된 이미지 배열 (최대 5장)
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  // 현재 카메라 방향: 전면(user) 또는 후면(environment)
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  /**
   * Promise timeout 헬퍼: getUserMedia가 응답없으면 강제 reject
   */
  function promiseWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Camera request timed out"));
      }, timeoutMs);

      promise
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }

  /**
   * 카메라 시작 함수
   */
  const startCamera = async () => {
    try {
      // 연결된 디바이스 목록 가져오기
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");

      let constraints: MediaStreamConstraints;

      // 카메라가 1개면 facingMode 무시
      if (videoInputs.length <= 1) {
        constraints = { video: true, audio: false };
      } else {
        constraints = {
          video: { facingMode: { exact: facingMode } },
          audio: false,
        };
      }

      // getUserMedia에 timeout 적용
      const stream = await promiseWithTimeout(
        navigator.mediaDevices.getUserMedia(constraints),
        5000
      );

      // 스트림 저장
      streamRef.current = stream;

      // 비디오에 스트림 연결
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);

      // ✅ 동일 에러 반복 방지용: 현재 facingMode와 반대로 전환
      // (즉시 alert 띄우기 전에 우선 상태 변경)
      setFacingMode("user");
      // setFacingMode((prev) => (prev === "user" ? "environment" : "user"));

      // 사용자에게 안내
      alert(
        "카메라 접근 중 오류가 발생했습니다.\n노트북이라면 카메라가 하나만 연결되어 있을 수 있습니다."
      );
    }
  };

  /**
   * facingMode가 변경되면 카메라 다시 시작
   */
  useEffect(() => {
    startCamera();

    // 언마운트 시 스트림 해제
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [facingMode]); // ✅ facingMode 변경되면 실행

  /**
   * 사진 촬영
   */
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 비디오 해상도 기준으로 캔버스 크기 지정 후 이미지 그리기
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");

        // 최신 이미지 맨 앞에 추가, 최대 5장 유지
        setCapturedImages((prev) => {
          const updated = [imageData, ...prev];
          return updated.slice(0, 5);
        });
      }
    }
  };

  /**
   * 사진 제출
   */
  const handleSubmit = async () => {
    if (capturedImages.length === 0) {
      alert("제출할 이미지가 없습니다.");
      return;
    }

    const formData = new FormData();
    capturedImages.forEach((base64, i) => {
      // base64 -> Blob
      const blob = dataURLtoBlob(base64);
      formData.append("files", blob, `camera_image_${i}.png`);
    });

    try {
      const res = await axios.post("/api/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert("업로드 성공!");
        setCapturedImages([]);
        goNext(); // 다음 단계로 이동
      } else {
        alert("업로드 실패");
      }
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류 발생");
    }
  };

  /**
   * base64 → Blob 변환 함수
   */
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  /**
   * 전/후면 카메라 전환
   */
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  /**
   * 촬영된 이미지 삭제
   */
  const removeImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative w-full h-full">
      {/* 캔버스 (숨김, 촬영용) */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* 카메라 비디오 & 버튼들 */}
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />

        {/* 촬영한 이미지 오버레이 */}
        <div className="absolute inset-0 p-4 flex flex-wrap items-start justify-start gap-2 pointer-events-none">
          {capturedImages.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={img}
                alt={`Captured ${idx}`}
                className="w-full h-full object-cover rounded border"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1 pointer-events-auto"
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <div className="absolute w-svw flex justify-around items-center bottom-10 left-1/2 transform -translate-x-1/2">
          {/* 전/후면 전환 버튼 */}
          <button
            onClick={toggleCameraFacing}
            className="px-4 py-2 bg-yellow-500 text-black rounded pointer-events-auto"
          >
            🔄 전/후면 전환
          </button>

          {/* 촬영 버튼 */}
          <button
            onClick={takePhoto}
            className={`px-6 py-3 bg-white/70 text-black rounded-full pointer-events-${
              capturedImages.length === 5 ? "none" : "auto"
            }`}
          >
            {capturedImages.length === 5 ? "최대 5장" : "📸 사진 촬영"}
          </button>

          {/* 제출 버튼 */}
          {/* TODO: capturedImages.length === 0 면 비활성화 */}
          <button
            onClick={handleSubmit}
            className={`px-6 py-3 bg-white/70 text-black rounded-full pointer-events-${
              capturedImages.length === 5 ? "none" : "auto"
            }`}
          >
            {capturedImages.length === 5 ? "최대 5장" : "📸 사진 제출"}
          </button>
        </div>

        {/* 취소 버튼 */}
        <button
          onClick={goBack}
          className="absolute top-5 right-5 px-4 py-2 bg-red-600 text-white rounded pointer-events-auto"
        >
          ✖ 뒤로
        </button>
      </div>
    </div>
  );
}
