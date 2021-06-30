export interface WithId {
  id: string;
}

export interface Bill {
  name: string;
  editors: { [key: string]: boolean };
  friends: string[];
  creator: string;
}

export type BillWithId = Bill & WithId;

export interface UserDoc {
  primaryBill: string;
}

export interface Item {
  id: string;
  description: string;
  cost: number;
  paidBy: string;
  date: Date; // TODO firebase date??
  sharedBy: SharedBy[];
}

interface SharedBy {
  friend: string;
  settled: boolean;
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

export interface SharedByElement {
  user: string;
  settled: boolean;
}

export interface NewItemWithBill {
  newItem: ItemElement;
  bill: Bill;
}

export interface NewBill {
  name: string;
  usersArray: string[];
  editorsArray: string[];
}

export interface AddUsersEditorsWithBill {
  usersAndEditors: {
    usersArray: string[];
    editorsArray: string[];
  };
  bill: Bill;
}

export interface Ledger {
  [key: string]: { [key: string]: number };
}

export interface DeleteItem {
  billId: string;
  itemId: string;
}
