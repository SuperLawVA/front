export default interface Article {
  result: boolean;
  content: string;
  reason: string;
  suggested_revision: string;
  negotiation_points: string;
  legal_basis: {
    law_id: string | number;
    law: string;
    explanation: string;
    link: string;
  } | null;
  case_basis: {
    case_id: string | number;
    case: string;
    explanation: string;
    link: string;
  }[];
}

export interface Agreement {
  result: boolean;
  content: string;
  reason: string;
  suggested_revision: string;
  negotiation_points: string;
  legal_basis: {
    law_id: string | number;
    law: string;
    explanation: string;
    link: string;
  } | null;
  case_basis: {
    case_id: string | number;
    case: string;
    explanation: string;
    link: string;
  }[];
}

// export default interface Article {
//   title: string;
//   result: boolean;
//   content: string;
//   reason: string;
//   suggested_revision: string;
//   negotiation_points: string;
//   legalBasis: {
//     law_id: string | number;
//     law: string;
//   };
//   legal_basis: {
//     law_id: string | number;
//     law: string;
//   };
//   caseBasis: {
//     case_id: string | number;
//     case: string;
//   }[];
//   case_basis: {
//     case_id: string | number;
//     case: string;
//   }[];
// }

// export interface Agreement {
//   result: boolean;
//   content: string;
//   reason: string;
//   suggested_revision: string;
//   negotiation_points: string;
//   legalBasis: {
//     law_id: string | number;
//     law: string;
//   };
//   caseBasis: {
//     case_id: string | number;
//     case: string;
//   }[];
//   legal_basis: {
//     law_id: string | number;
//     law: string;
//   };
//   case_basis: {
//     case_id: string | number;
//     case: string;
//   }[];
// }
