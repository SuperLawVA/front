import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { initTokenAutoRefresh } from "@/lib/tokenRefreshManager";
import { UserActionLoggerClient } from "@/components/UserActionLoggerClient";
import { useUserActionLogger } from "@/lib/useUserActionLogger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Super Lawva",
  description: "Law Virtual Assistant",
};

const pretendard = localFont({
  src: "fonts/PretendardVariable.woff2",
  display: "block",
  weight: "45 920",
  variable: "--font-pretendard",
});

const USER_ID = true ? "tester" : "none";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if (typeof window !== "undefined") {
  //   // useUserActionLogger({ userId: USER_ID });
  //   initTokenAutoRefresh();
  // }
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} antialiased w-full`}
    >
      <body
        // className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} antialiased w-full`}
        className="subpixel-antialiased w-full"
      >
        <UserActionLoggerClient userId={USER_ID} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
