import { ReactNode, HTMLAttributes } from "react";

type DivBoxProps = {
  textColor?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export default function DivBox({
  textColor = "rgba(0, 0, 0, 0.7)",
  className = "",
  children,
  style = {},
}: DivBoxProps) {
  return (
    <div
      className={className}
      style={{
        background: "white",
        border: "1px solid #f3f4f6",
        borderRadius: "20px",
        fontSize: "1.2rem",
        color: textColor,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
