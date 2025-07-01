import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} antialiased w-full`}
    >
      <body
        // className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} antialiased w-full`}
        className="subpixel-antialiased w-full h-min-svh"
      >
        {/* <UserActionLoggerClient /> */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}
