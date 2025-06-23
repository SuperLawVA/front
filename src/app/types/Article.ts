export default interface Article {
  title: string;
  result: boolean;
  content: string;
  reason: string;
  suggestedRevision: string;
  negotiationPoints: string;
  legalBasis: {
    lawId: string | number;
    law: string;
  };
  caseBasis: {
    caseId: string | number;
    case: string;
  }[];
}

export interface Agreement {
  result: boolean;
  content: string;
  reason: string;
  suggestedRevision: string;
  negotiationPoints: string;
  legalBasis: {
    lawId: string | number;
    law: string;
  };
  caseBasis: {
    caseId: string | number;
    case: string;
  }[];
}
