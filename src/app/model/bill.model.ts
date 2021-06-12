export interface Bill {
  name: string;
  users: { string: string }[];
  items: Item[];
}

export interface Item {
  description: string;
  cost: number;
  paidBy: string;
  sharedBy: string[];
}
