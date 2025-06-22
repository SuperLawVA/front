export interface Contract {
  _id: string;
  title: string;
  state: string;
  address: string;
  createdAt: string;
}

export interface RecentChat {
  _id: string;
  title: string;
}
[];

export interface AnalysisTarget {
  _id: string;
  generated: Boolean;
  modifiedDate: Date;
  title: string;
  contractType: string;
  contractDate: Date | null;
  buildingType: string | null;
}
