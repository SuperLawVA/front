"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import imageCompression from "browser-image-compression";
import axios from "axios";

interface UploadPageProps {
  setPageOpen: () => void;
}

// ✅ 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// ✅ 업로드 허용 최대 개수
const MAX_FILES = 5;

// ✅ 이미지 파일 타입 정의: 실제 File + 미리보기 URL
interface ImageFile {
  file: File;
  previewUrl: string;
  fileName: string; // ✅ 고유 파일명 보관
}

// ✅ 이미지 유효성 검사 함수
// 실제 이미지를 브라우저에 로드해보고 실패하면 false 반환
async function validateImage(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}

// ✅ 이미지 압축 함수 (해상도, 품질 제한)
async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // 최대 1MB
    maxWidthOrHeight: 1280, // 긴 변 기준 최대 해상도
    useWebWorker: true, // 성능 위해 Web Worker 사용
    initialQuality: 0.8, // 품질 낮춰서 압축 강도 높임
  };

  try {
    return await imageCompression(file, options);
  } catch {
    console.warn("압축 실패, 원본 사용");
    return file;
  }
}

export default function UploadPage({ setPageOpen }: UploadPageProps) {
  // ✅ 업로드된 이미지 배열 (압축된 파일 + 미리보기 URL)
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  // ✅ 현재 보고 있는 이미지 index (스와이프용)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ 스와이프 핸들러 (좌우로 넘기기)
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentImageIndex < imageFiles.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true, // 마우스로도 swipe 가능
  });

  // ✅ 파일 선택 시 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newValidImages: ImageFile[] = [];

    // 선택한 파일들을 하나씩 검사
    for (const file of selectedFiles) {
      // 새로 추가한 것만으로 MAX_FILES 다 차면 멈춤
      if (newValidImages.length === MAX_FILES) {
        alert("최대 5개 이미지까지 업로드 가능합니다.");
        break;
      }

      // 크기 검사
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}은 5MB 초과`);
        continue;
      }

      // MIME 타입 검사
      if (!file.type.startsWith("image/")) {
        alert(`${file.name}은 이미지 아님`);
        continue;
      }

      // 유효 이미지인지 검사
      const valid = await validateImage(file);
      if (!valid) {
        alert(`${file.name} 유효하지 않음`);
        continue;
      }

      const compressed =
        file.size > 1024 * 1024 ? await compressImage(file) : file;

      // ✅ 고유 파일명 생성
      const uniqueName = `${Date.now()}_${file.name}`;

      // ✅ File 객체의 name을 강제로 바꿀 수는 없으므로,
      // FormData 전송할 때만 uniqueName을 사용하면 됨.
      const previewUrl = URL.createObjectURL(compressed);

      // ✅ 추가 시 이름 포함
      newValidImages.push({
        file: compressed,
        previewUrl,
        fileName: uniqueName,
      });

      // if (imageFiles.length + newValidImages.length >= MAX_FILES) {
      //   alert(`최대 ${MAX_FILES}개만 업로드 가능`);
      //   break;
      // }
    }

    // ✅ 기존 + 새 이미지 합쳐서 MAX_FILES 까지 자르기
    setImageFiles((prev) => {
      const combined = [...prev, ...newValidImages].slice(0, MAX_FILES);

      // 현재 인덱스도 안전하게 보정
      setCurrentImageIndex((prevIndex) =>
        combined.length === 0 ? 0 : Math.min(prevIndex, combined.length - 1)
      );

      return combined;
    });

    // ✅ input 초기화 (같은 파일 또 선택할 수 있게)
    e.target.value = "";
  };

  // ✅ 미리보기에서 이미지 제거
  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      // revoke 먼저
      URL.revokeObjectURL(prev[index].previewUrl);

      // 삭제 후 새 배열
      const newArray = prev.filter((_, i) => i !== index);

      // 인덱스도 같이 갱신하려면:
      setCurrentImageIndex((prevIndex) =>
        Math.max(Math.min(prevIndex, newArray.length - 1), 0)
      );

      return newArray;
    });
  };

  // ✅ 최종 서버 업로드
  const handleSubmit = async () => {
    if (imageFiles.length === 0) {
      alert("업로드할 파일이 없습니다");
      return;
    }

    const formData = new FormData();

    // ✅ 파일과 이름을 함께 append
    imageFiles.forEach((img) => {
      formData.append("files", img.file);
      formData.append("fileNames", img.fileName); // 파일 이름도 같이
    });

    try {
      const res = await axios.post("/api/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        imageFiles.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setImageFiles([]);
        setPageOpen();
        alert("업로드 성공");
        setCurrentImageIndex(0);
      } else {
        alert("업로드 실패");
      }
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류 발생");
    }
  };

  // ✅ 페이지 언마운트 시 Object URL 해제 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      imageFiles.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  return (
    <main className="p-8 w-svw h-full">
      <h1 className="text-[1.7rem] font-bold mb-4 text-center">이미지 업로드</h1>
      {/* 수정해보았습니다 */}
      {/* 파일 선택 버튼 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="!text-[1.2rem] ml-2"
        >
          파일 선택
        </button>

        {/* 숨겨진 input */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* 선택된 파일 없음 메시지 */}
        {imageFiles.length === 0 && (
          <p className="text-[1.1rem] text-gray-500 absolute ml-2">
            선택된 파일 없음
          </p>
        )}
      <p className="text-[1.1rem] ml-[17rem] text-gray-500 mb-4">
        (최대 {MAX_FILES}개 파일, 각 5MB 이하, 현재 {imageFiles.length}개)
      </p>

      {/* ✅ 미리보기 + 스와이프 */}
      {imageFiles.length > 0 && (
        <div className="mb-6">
          <div {...handlers} className="relative w-full max-w-lg mx-auto">
            <img
              src={imageFiles[currentImageIndex].previewUrl}
              alt={`미리보기 ${currentImageIndex + 1}`}
              style={{
                width: "100%",
                // height: "400px",
                objectFit: "contain",
                margin: "0 auto",
              }}
              className="border rounded-lg"
            />
            {/* 제거 버튼 */}
            <button
              onClick={() => removeImage(currentImageIndex)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* ✅ 스와이프 인디케이터 */}
          <div className="flex justify-center gap-2 mt-4">
            {imageFiles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-3 h-3 rounded-full ${
                  idx === currentImageIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ 서버 전송 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={imageFiles.length === 0}
        className="w-full py-4 px-4 bg-blue-500 
                text-white !text-[1.2rem] !font-medium 
                rounded-[12px] hover:bg-blue-600 
                disabled:opacity-50 transition-colors"
      >
        업로드 ({imageFiles.length}개 파일)
      </button>
    </main>
  );
}
