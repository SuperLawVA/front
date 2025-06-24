// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken"; // (옵션) JWT 디코딩용 - 예시

export function middleware(request: NextRequest) {
  // 1️⃣ 현재 요청 URL 경로 추출
  const { pathname } = request.nextUrl;

  // 2️⃣ 로그인 없이 접근 가능한 공개 경로 리스트
  const publicPaths = ["/start", "/login", "/register"];

  // 3️⃣ 쿠키에서 토큰 읽기 (쿠키 이름: token)
  console.log(request.cookies.toString());

  const token = request.cookies.get("jwt")?.value;

  // 4️⃣ 로그인 되어 있으면 → 공개 경로 접근은 막는다 → 홈("/")으로 이동
  if (publicPaths.includes(pathname)) {
    if (token) {
      // 예: 이미 로그인 한 유저가 다시 /login 접근 시 홈으로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (["/login"].includes(pathname)) {
    if (!token) {
      return NextResponse.next();
    }
  }

  // 5️⃣ 로그인 안 되어 있으면 → 공개 경로 외 접근은 막는다 → 로그인 페이지로 이동
  if (!publicPaths.includes(pathname)) {
    if (!token) {
      // 인증 안된 상태에서 보호된 페이지 접근 시 로그인으로 리다이렉트
      return NextResponse.redirect(new URL("/start", request.url));
    }

    // // (옵션) JWT 디코딩 예시
    // try {
    //   // 토큰 유효성 확인 (예: JWT라면)
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // } catch (err) {
    //   // 만료되었거나 변조된 토큰 → 로그인 페이지로 리다이렉트
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }
  }

  // 6️⃣ 그 외는 정상 요청 통과
  return NextResponse.next();
}

// 7️⃣ matcher 설정
export const config = {
  matcher: [
    /*
      모든 요청에 적용하되,
      _next/static, _next/image, favicon.ico 같은 정적 리소스는 제외
    */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif)$).*)",
    "/", // 루트 페이지도 직접 명시!
  ],
};
