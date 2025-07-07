"use client";

import clientApi from "@/lib/axios.client";
import React, { useRef, useEffect, useState } from "react";

interface UploadPageProps {
  goBack: () => void;
  goNext: () => void;
  setIsLoading: (loading: boolean) => void;
}

const MAX_IMAGE = 1;

export default function CameraPage({
  goBack,
  goNext,
  setIsLoading,
}: UploadPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const promiseWithTimeout = <T,>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> => {
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
  };

  // ✅ 카메라 디바이스 목록 불러오기 (권한 요청 포함)
  const loadCameraDevices = async () => {
    try {
      // 먼저 권한 요청 (label을 얻기 위해 필요)
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videos = devices.filter((d) => d.kind === "videoinput");
      setCameraDevices(videos);
    } catch (err) {
      console.error("카메라 목록 불러오기 실패:", err);
      alert("카메라 권한이 필요합니다.");
    }
  };

  // ✅ 카메라 시작 with facingMode fallback
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let stream: MediaStream | null = null;

      // ✅ 1. 먼저 environment 시도
      try {
        stream = await promiseWithTimeout(
          navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } },
            audio: false,
          }),
          5000
        );
        console.log("✅ environment 카메라 시작 성공");
      } catch (envErr) {
        console.log("envErr");
        console.log(envErr);

        console.warn("⚠️ environment 카메라 시작 실패, deviceId fallback 시도");

        // ✅ 2. deviceId fallback
        if (cameraDevices.length > 0) {
          const selectedDevice = cameraDevices[currentCameraIndex];

          // 예시: 망원 카메라 우선 탐색
          const telephoto = cameraDevices.find((d) =>
            d.label.toLowerCase().includes("tele")
          );

          const fallbackDevice = telephoto || selectedDevice;

          stream = await promiseWithTimeout(
            navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: fallbackDevice.deviceId } },
              audio: false,
            }),
            5000
          );
          console.log(`✅ deviceId(${fallbackDevice.label}) 카메라 시작 성공`);
        } else {
          alert("사용 가능한 카메라가 없습니다.");
          return;
        }
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("카메라 접근 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadCameraDevices();
  }, []);

  useEffect(() => {
    if (cameraDevices.length > 0) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCameraIndex, cameraDevices]);

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

        setCapturedImages((prev) => {
          const updated = [imageData, ...prev];
          return updated.slice(0, MAX_IMAGE);
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (capturedImages.length === 0) {
      alert("제출할 이미지가 없습니다.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    capturedImages.forEach((base64, i) => {
      const blob = dataURLtoBlob(base64);
      formData.append("files", blob, `camera_image_${i}.png`);
      formData.append("fileNames", `camera_image_${i}.png`);
    });

    try {
      const response = await clientApi.post("/upload", formData);
      console.log("response");
      console.log(response);

      if (response.status === 200) {
        if (response.data._id)
          sessionStorage.setItem("contractId", response.data._id);
        else if (typeof response.data === "string")
          sessionStorage.setItem("contractId", response.data);
        else throw Error;
        alert("업로드 성공!");
        setCapturedImages([]);
        goNext();
      } else {
        alert("업로드 실패");
      }
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const toggleCameraFacing = () => {
    if (cameraDevices.length > 1) {
      setCurrentCameraIndex((prev) => (prev + 1) % cameraDevices.length);
    } else {
      alert("전환할 카메라가 없습니다.");
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="relative w-full h-full">
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

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
            <button
              onClick={toggleCameraFacing}
              className="px-4 py-2 bg-yellow-500 text-black rounded pointer-events-auto"
            >
              🔄 카메라 전환
            </button>

            <button
              onClick={takePhoto}
              className={`px-6 py-3 bg-white/70 text-black rounded-full pointer-events-${
                capturedImages.length === MAX_IMAGE ? "none" : "auto"
              }`}
            >
              {capturedImages.length === MAX_IMAGE
                ? `최대 ${MAX_IMAGE}장`
                : "📸 사진 촬영"}
            </button>

            <button
              onClick={handleSubmit}
              className={`px-6 py-3 bg-white/70 text-black rounded-full pointer-events-${
                capturedImages.length === 0 ? "none" : "auto"
              }`}
            >
              {capturedImages.length === 0
                ? `최대 ${MAX_IMAGE}장`
                : "📸 사진 제출"}
            </button>
          </div>

          <button
            onClick={goBack}
            className="absolute top-5 right-5 px-4 py-2 bg-red-600 text-white rounded pointer-events-auto"
          >
            ✖ 뒤로
          </button>
        </div>
      </div>
    </>
  );
}
