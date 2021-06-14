export interface Bill {
  uid: string;
  name: string;
  users: { [key: string]: string };
  usersArray: string[];
  items: Items;
}

export interface Items {
  [key: string]: ItemElement;
}

export interface ItemElement {
  description: string;
  cost: number;
  paidBy: string;
  date: Date; // TODO firebase date??
  sharedBy: SharedBy;
}

export interface SharedBy {
  [key: string]: SharedByElement;
}

export interface SharedByElement {
  user: string;
  settled: boolean;
}

export interface NewItemWithBill {
  newItem: ItemElement;
  bill: Bill;
}

export interface SettledChange {
  checked: boolean;
  itemKey: string;
  sharedByKey: string;
  billId: string;
}
