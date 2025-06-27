export interface Contract {
  _id?: string;
  title?: string;
  state?: string;
  address?: string;
  createdAt?: string;
  generated?: boolean;
  contractType?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface RecentChat {
  _id: string;
  title: string;
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
