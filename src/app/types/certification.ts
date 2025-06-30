export interface Certification {
  _id: number;
  userId: number;
  contractId: number;

  createdDate: string; // ISO 8601
  title: string;

  receiver: {
    name: string;
    address: string;
    detailAddress: string;
  };

  sender: {
    name: string;
    address: string;
    detailAddress: string;
  };

  body: string;
  strategySummary: string | null;
  followupStrategy: string;

  legalBasis: Array<{
    lawId: number;
    law: string;
    explanation: string;
    content: string;
  }>;

  caseBasis: Array<{
    caseId: number;
    case: string;
    explanation: string;
    link: string;
  }>;

  generationTime: number;
  userQuery: string;
}
