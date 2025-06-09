export interface IParkingSpace {
  id: string;
  name: string;
  resourceId: string;
  occupied: boolean;
  lastUpdated: string;
}

export interface IHistory {
  id: string;
  history: { time: string; value: string }[];
}
