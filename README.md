# SuperLawVA 🏛️

<div align="center">
  <img src="public/logo.svg" alt="SuperLawVA Logo" width="200"/>
  <p>
    <strong>AI-Powered Legal Assistant for Smart Legal Solutions</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-13-black?style=flat-square&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
  </p>
</div>

## 📋 목차 (Table of Contents)

- [소개 (Introduction)](#소개-introduction)
- [주요 기능 (Key Features)](#주요-기능-key-features)
- [기술 스택 (Tech Stack)](#기술-스택-tech-stack)
- [시작하기 (Getting Started)](#시작하기-getting-started)
- [프로젝트 구조 (Project Structure)](#프로젝트-구조-project-structure)
- [라이선스 (License)](#라이선스-license)

## 소개 (Introduction)

SuperLawVA는 AI 기술을 활용한 법률 지원 서비스입니다. 계약서 분석, 법률 문서 생성, 법률 상담 챗봇 등 다양한 법률 서비스를 제공하여 사용자들이 더 쉽고 효율적으로 법률 문제를 해결할 수 있도록 도와줍니다.

## 주요 기능 (Key Features)

### 📄 계약서 분석 (Contract Analysis)

- AI 기반 계약서 자동 분석
- 주요 조항 추출 및 위험 요소 파악
- 계약서 요약 및 설명 제공

### 💬 법률 상담 챗봇 (Legal Chatbot)

- 24/7 실시간 법률 상담
- 맞춤형 법률 정보 제공
- 대화 기록 저장 및 관리

### ✍️ 법률 문서 생성 (Legal Document Creation)

- 다양한 유형의 계약서 자동 생성
- 맞춤형 법률 문서 작성
- 인증서 및 공식 문서 생성

### 🔍 법률 정보 검색 (Legal Information Search)

- 법령, 판례, 용어 통합 검색
- FAQ 및 법률 정보 제공
- 실시간 법률 정보 업데이트

## 기술 스택 (Tech Stack)

- **Frontend**

  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS

- **Backend**

  - Next.js API Routes
  - MongoDB
  - AI/ML Services

- **DevOps & Tools**
  - Git
  - ESLint
  - PostCSS

## 시작하기 (Getting Started)

1. **환경 설정**

   ```bash
   # 저장소 클론
   git clone [repository-url]
   cd SuperLawVA

   # 의존성 설치
   npm install
   ```

2. **환경 변수 설정**

   ```bash
   # .env.local 파일 생성
   cp .env.example .env.local
   # 필요한 환경 변수 설정
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

## 프로젝트 구조 (Project Structure)

```
SuperLawVA/
├── src/
│   ├── app/             # 페이지 및 라우팅
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── lib/            # 유틸리티 및 설정
│   ├── store/          # 상태 관리
│   └── types/          # TypeScript 타입 정의
├── public/             # 정적 파일
└── ...설정 파일
```

## 라이선스 (License)

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">
  <p>Made with ❤️ by SuperLawVA Team</p>
</div>
