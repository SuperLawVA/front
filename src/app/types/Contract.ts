export default interface Contract {
  _id: string;
  id: string;
  userId: string;
  generated: boolean;
  createdDate: string;
  modifiedDate: string;
  contractType: string;
  generationTime: number;
  __v: number;
  userQuery: string[];
  contractMetadata: {
    model: string;
    version: string;
    generationTime: number;
  };
  dates: {
    contractDate: string;
  };
  property: {
    land: {
      landType: string;
      landRightRate: string;
      landArea: number;
    };
    building: {
      buildingConstructure: string;
      buildingType: string;
      buildingArea: string;
    };
    address: string;
    detailAddress: string;
    rentSection: string;
    rentArea: string;
  };
  payment: {
    deposit: number;
    depositKr: string;
    downPayment: number;
    downPaymentKr: string;
    intermediatePayment: number;
    intermediatePaymentKr: string;
    intermediatePaymentDate: string;
    remainingBalance: number;
    remainingBalanceKr: string;
    remainingBalanceDate: string;
    monthlyRent: number;
    monthlyRentDate: string;
    paymentPlan: string;
  };
  articles: any[]; // articles의 상세 타입이 필요하면 추가 정의
  agreements: Agreement[];
}

export interface Agreement {
  reason: string;
  suggested_revision: string;
  negotiation_points: string;
  _id: string;
  id: string;
}
