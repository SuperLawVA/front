"use client";

import { StyledInputProps } from "@/app/types/CustomStyledProps";

export default function StyledInput({
  width = "full",
  fontWeight = 400,
  fontSize = "1.4rem",
  type = "text",
  lineHeight = 2,
  className,
  ...rest
}: StyledInputProps) {
  return (
    <div className={`flex flex-col justify-start ${className}`}>
      <input
        type={type}
        className="border-none px-4 outline-none placeholder:text-gray-400"
        style={{
          width: typeof width === "number" ? `${width}rem` : width,
          fontWeight: fontWeight,
          fontSize: typeof fontSize === "number" ? `${fontSize}rem` : fontSize,
          lineHeight:
            typeof lineHeight === "number" ? `${lineHeight}rem` : lineHeight,
        }}
        {...rest}
      />
      <div
        className="mt-[0.6rem] border-[0.15rem] border-[#bbb6]"
        style={{
          width: typeof width === "number" ? `${width}rem` : width,
        }}
      />
    </div>
  );
}
