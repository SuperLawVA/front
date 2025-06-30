export interface Contract {
  _id?: string;
  contractTitle?: string;
  state?: string;
  property: { address: string };
  createdAt?: string;
  generated?: boolean;
  contractType?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface Chat {
  _id: string;
  sessionId: string;
  chatTitle: string;
}

export interface AnalysisTarget {
  _id: string;
  address?: string;
  generated?: boolean;
  modifiedDate?: string;
  contractType?: string;
  contractDate?: string;
  buildingType?: string;
}
