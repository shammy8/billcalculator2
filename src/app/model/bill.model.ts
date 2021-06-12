export interface Bill {
  uid: string;
  name: string;
  users: { [key: string]: string };
  usersArray: string[];
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

export interface NewItemWithBill {
  newItem: Item;
  bill: Bill;
}
