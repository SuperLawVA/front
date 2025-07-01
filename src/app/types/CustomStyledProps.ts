import { HTMLInputTypeAttribute } from "react";

// ✅ 공통 스타일 Props
export default interface CustomStyledProps {
  width?: number | string;
  height?: number | string;
  fontColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  gap?: number;
  background?: string;
  borderColor?: string;
  borderRadius?: number | string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  subStyle?: boolean;
}

// ✅ 버튼 전용 Props
export interface CustomButtonProps
  extends CustomStyledProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

// ✅ Input 전용 Props
export interface StyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    CustomStyledProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value?: number | string;
  lineHeight?: number | string;
  autoFocus?: boolean;
  InputclassName?: string;
  underLine?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
