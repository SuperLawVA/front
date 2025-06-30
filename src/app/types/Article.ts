export default interface Article {
  result: boolean;
  content: string;
  reason: string;
  suggestedRevision: string;
  negotiationPoints: string;
  legalBasis: {
    lawId: string | number;
    law: string;
    explanation: string;
    link: string;
  } | null;
  caseBasis: {
    caseId: string | number;
    case: string;
    explanation: string;
    link: string;
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
    explanation: string;
    link: string;
  } | null;
  caseBasis: {
    caseId: string | number;
    case: string;
    explanation: string;
    link: string;
  }[];
}
