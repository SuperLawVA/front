// app/api/certificate/result/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ 클라이언트에서 JSON 본문 받기
    const { contractId, certificateId } = await req.json();

    // 2️⃣ 필요한 값 추출
    const userId = (await cookies()).get("userId");

    // 값 검증 예시
    if (!userId || !contractId || !certificateId) {
      return NextResponse.json(
        { message: "userId, contractId, certificateId는 필수입니다." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        // 내용증명서 고유 ID
        _id: "101",
        // 사용자 ID
        userId: 123,
        // 연관된 계약 문서 ID
        contractId: "123",
        // 생성 시간
        createdDate: "2026-06-30T00:00:00Z",
        // 인증서 제목
        title: "임대차보증금 반환 촉구서",
        // 수신자 정보 그룹
        receiver: {
          // 수신자 이름
          name: "홍길동",
          // 수신자 기본 주소
          address: "서울특별시 강남구 테헤란로 123",
          // 수신자 상세 주소
          detailAddress: "101동 202호",
        },

        // 발신자 정보 그룹
        sender: {
          // 발신자 이름
          name: "김법무",
          // 발신자 기본 주소
          address: "서울특별시 서초구 서초대로 456",
          // 발신자 상세 주소
          detailAddress: "법무빌딩 5층",
        },

        // 내용증명 본문
        body: `“귀하의 건강과 평안을 기원합니다.”

본인은 2025년 7월 1일 귀하와 체결한 서울시 성동구 성수동 101-12 B동 802호 8층 아파트에 대한 전세계약(보증금 80,000,000원, 계약기간 2025.07.01~2027.06.30)의 임차인 김민준입니다.

현재 전입신고를 위해 임대차계약서 사본 교부를 요청드렸으나, 귀하께서 세금 문제를 이유로 계약서 교부 및 전입신고를 거부하고 계신 상황입니다.

이에 다음과 같이 법적 근거를 바탕으로 정중히 요청드립니다.

[법적 근거]
1. 전입신고는 임차인의 법정 권리입니다  
「주택임대차보호법」 제3조에서 규정하는 바와 같이 '임차인은 주택의 인도와 주민등록을 마친 때에 제3자에 대하여 효력이 생긴다'고 명시되어 있어, 전입신고는 임차인의 대항력 취득을 위한 필수 요건이자 법정 권리입니다.  

2. 임대인의 협조 의무  
임대차계약이 적법하게 체결된 이상, 임차인의 전입신고에 필요한 서류 제공은 임대인의 당연한 협조 의무에 해당됩니다.

3. 세금 문제는 별개 사안입니다  
「국세징수법」 제109조 제1항에 따르면 '주거용 건물을 임차하여 사용하려는 자는 해당 건물에 대한 임대인의 국세 체납 여부를 확인할 수 있다'고 규정하고 있으나, 이는 임차인의 권리 보호를 위한 규정이며, 임대인의 세금 문제가 임차인의 전입신고 권리를 제한하는 근거가 될 수 없습니다.

[구체적 요청사항]
1. 임대차계약서 사본 1부 교부  
2. 전입신고에 필요한 임대인 신분증 사본 제공  
3. 전입신고 절차에 대한 적극적 협조

[제안사항]
귀하께서 우려하시는 세금 문제와 관련하여서 다음과 같은 해결방안을 제안드립니다.
- 세무 전문가 상담을 통한 적법한 세무 처리 방안 모색
- 필요 시 임대소득 신고 등 정당한 절차 이행
- 상호 협의를 통한 해결책 마련

[이행 기한]
본 통지서 수령 후 7일 이내(2025년 1월 15일까지)에 상기 요청사항에 대한 이행 또는 협의 의사를 회신하여 주시기 바랍니다.

[결어]
전입신고는 임차인의 정당한 권리이며, 이를 위한 세류 제공은 임대인의 기본적인 협조 의무입니다. 귀하의 세금 문제에 대해서는 충분히 이해하며, 상호 협의를 통해 원만히 해결할 수 있을 것으로 믿습니다. 만약 정당한 사유 없이 계속해서 협조를 거부하실 경우, 부득이하게 관련 기관 신고 및 법적 조치를 검토할 수 밖에 없음을 양해해 주시기 바랍니다. 귀하의 현명한 판단과 적극적인 협조를 기대하며, 조속한 회신을 부탁드립니다.

2025년 1월 8일  
발신인: 김민준 (인)`,

        // 내용증명 목적(전략) 요약
        strategySummary: `임차인의 전입신고 권리를 법적 근거로 명확히 제시하면서도,
임대인의 세금 우려사항을 이해하고 상호 협의를 통한 해결책을 제안하는 협력적 접근 전략을 채택하였습니다.
주택임대차보호법상 대항력 취득 권리와 국세징수법상 확인 권리를 구분하여 설명함으로써 법적 정당성을 확보하되,
과도한 위협보다는 합리적 해결을 추구하는 균형잡힌 어조를 유지하였습니다.`,

        // 추후 대응 전략
        followupStrategy: "계약 갱신 시 동일 조건 유지 및 법적 보장 강화.",
        // 관련 법적 해설 (JSON 배열)
        legalBasis: [
          {
            lawId: 1,
            law: "주택임대차보호법 제4조",
            explanation: "임대차 기간 중 계약 해지 불가 규정.",
          },
          {
            lawId: 2,
            law: "민법 제390조",
            explanation: "채무불이행 시 손해배상 책임.",
          },
          {
            lawId: 3,
            law: "국세징수법 제96조",
            explanation: "납세증명 제출 의무 규정.",
          },
        ],
        caseBasis: [
          {
            caseId: 1,
            case: "대법원 2019다12345",
            explanation: "계약 위반 시 손해배상 인정 판례.",
          },
          {
            caseId: 2,
            case: "서울고법 2018나54321",
            explanation: "임대차 기간 내 해지 효력 부인 판례.",
          },
          {
            caseId: 3,
            case: "대법원 2020다54321",
            explanation: "임대차보증금 반환 책임 판례.",
          },
        ],
      },
      { status: 200 }
    );

    // // 3️⃣ Spring Boot 서버에 POST 요청 보내기
    // const springResponse = await axios.post(
    //   "http://localhost:8080/api/certificate", // 👉 Spring 엔드포인트
    //   {
    //     userId,
    //     contractId,
    //     certificateId,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // // 4️⃣ Spring Boot의 응답을 클라이언트에 전달
    // return NextResponse.json(springResponse.data, {
    //   status: springResponse.status,
    // });
  } catch (error: any) {
    console.error("Certificate API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
