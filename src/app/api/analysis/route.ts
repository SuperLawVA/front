// app/api/analysis/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = (await cookies()).get("userId");
    console.log(userId);
    console.log(req);

    // try {
    //   // Spring Boot의 로그인 API 호출
    //   const res = await axios.post("http://localhost:8080/api/analysis", userId, {
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const { contract } = res.data; // Spring Boot가 반환한 JWT

    // 여기서는 임시 Mock
    const contract = [
      {
        _id: "asdasd",
        generated: false,
        modifiedDate: new Date("2024-07-03"),
        title: "계약서 1",
        contractType: "월세",
        contractDate: new Date("2024-07-03"),
        buildingType: "공동주택",
      },
      {
        _id: "asdasd2",
        generated: true,
        modifiedDate: new Date("2024-07-02"),
        title: "계약서 2",
        contractDate: null,
        contractType: "전세",
        buildingType: null,
      },
    ];
    contract.sort(
      (a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime()
    );

    // const mockData = [
    //   {
    //     _id: "asdasd",
    //     title: "계약서 1",
    //     contractType: "월세",
    //     contractDate: "2024-07-01",
    //     buildingType: "철근콘크리트",
    //   },
    //   {
    //     _id: "asdasd",
    //     title: "계약서 2",
    //     contractType: "전세",
    //     contractDate: "2024-06-15",
    //     buildingType: "목조",
    //   },
    // ];

    // 예: userId에 따라 필터링 할 수도 있음.
    // const contracts = mockData; // 예시: 필터 없이 전체 반환

    // return NextResponse.json({ success: true, contracts }, { status: 200 });
    return NextResponse.json({ success: true, contract }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
