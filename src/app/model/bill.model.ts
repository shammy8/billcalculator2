export interface Bill {
  name: string;
  users: { string: string }[];
  items: Item[];
}

export interface Item {
  description: string;
  cost: number;
  paidBy: string;
  date: Date; // TODO firebase date??
  sharedBy: SharedBy[];
}

export interface SharedBy {
  user: string;
  settled: boolean;
}
