export default interface Contract {
  _id: string;
  id: string;
  userId: string;
  generated: boolean;
  createdDate: string;
  modifiedDate: string;
  contractType: string;
  contractTitle: string;
  generationTime: number;
  _v: number;
  userQuery: string[];
  contractMetadata: {
    model: string;
    version: string;
    generationTime: number;
  };
  dates: {
    contractDate: string;
    startDate: string;
    endDate: string;
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
  articles: string[]; // articles의 상세 타입이 필요하면 추가 정의
  agreements: Agreement[];
  basicAgreements: BasicAgreements[];
}

export interface BasicAgreements {
  reason: string;
  suggestedRevision: string;
}
export interface Agreement extends BasicAgreements {
  negotiationPoints: string;
}
