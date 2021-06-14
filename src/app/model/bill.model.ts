export interface Bill {
  uid: string;
  name: string;
  users: { [key: string]: string };
  usersArray: string[];
  items: { [key: string]: Item };
}

export interface Item {
  description: string;
  cost: number;
  paidBy: string;
  date: Date; // TODO firebase date??
  sharedBy: { [key: string]: SharedBy };
}

export interface SharedBy {
  user: string;
  settled: boolean;
}

export interface NewItemWithBill {
  newItem: Item;
  bill: Bill;
}
