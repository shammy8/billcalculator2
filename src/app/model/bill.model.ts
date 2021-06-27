// import firebase from 'firebase/app';

export interface Bill {
  key: string;
  name: string;
  viewers: { [key: string]: boolean };
  friends: string[];
  creator: string;
  createdAt: number; // TODO should be firebase.database.ServerValue.TIMESTAMP
}

// export interface Items {
//   [key: string]: ItemElement;
// }

export interface Item {
  key: string;
  description: string;
  cost: number;
  paidBy: string;
  date: Date; // TODO firebase date??
  sharedBy: SharedBy[];
}

// export interface ItemElement {
//   description: string;
//   cost: number;
//   paidBy: string;
//   date: Date; // TODO firebase date??
//   sharedBy: SharedBy;
// }

// export interface SharedBy {
//   [key: string]: SharedByElement;
// }

export interface SharedBy {
  friend: string;
  settled: boolean;
}

// export interface NewItemWithBill {
//   newItem: ItemElement;
//   bill: Bill;
// }

export interface SettledChange {
  checked: boolean;
  itemKey: string;
  sharedByKey: number;
  billId: string;
}

export interface NewBill {
  name: string;
  friends: string[];
  viewers: string[];
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
