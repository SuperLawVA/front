"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import HomeIcon from "./icons/Home";
import ChatIcon from "./icons/Chat";
import EllipsisIcon from "./icons/Ellipsis";

interface NavBtnProps {
  to: string;
  icon: React.FC<{ width: number; height: number; color: string }>;
  label: string;
}

interface BottomNavProps {
  mainBackGroundColor?: string;
}

const NavBtn: React.FC<NavBtnProps> = ({ to, icon: Icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} className="flex flex-col items-center gap-1">
      <Icon width={2.4} height={2.4} color={isActive ? "active" : "#9CA3AF"} />
      <span
        className={`text-[1.2rem] ${
          isActive
            ? "bg-gradient-to-br from-[#6000FF]/70 to-[#E100FF]/70 bg-clip-text text-transparent"
            : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({
  mainBackGroundColor = "white",
}) => {
  return (
    <nav
      className="sticky bottom-0 w-full h-28"
      style={{ backgroundColor: mainBackGroundColor }}
    >
      <div className="h-full border-t border-[#c6c6c8] pt-4 z-10 rounded-t-[50px]">
        <div className="flex justify-around items-center h-full">
          <NavBtn to="/" icon={HomeIcon} label="홈" />
          <NavBtn to="/chatbot" icon={ChatIcon} label="채팅" />
          <NavBtn to="/more" icon={EllipsisIcon} label="내 정보" />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
