import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { nanoid } from 'nanoid';
import {
  Bill,
  NewBill,
  NewItemWithBill,
  SettledChange,
} from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(private store: AngularFirestore) {}

  addItem(newItemWithBill: NewItemWithBill) {
    const doc = this.store.doc<Bill>(`bills/${newItemWithBill.bill.uid}`);
    doc.update({
      [`items.${nanoid(8)}`]: newItemWithBill.newItem,
    });
  }

  settledChanged(settleChange: SettledChange) {
    const doc = this.store.doc<Bill>(`bills/${settleChange.billId}`);
    doc.update({
      [`items.${settleChange.itemKey}.sharedBy.${settleChange.sharedByKey}.settled`]:
        settleChange.checked,
    });
  }

  addBill(newBill: NewBill, userUid: string) {
    const billCollection = this.store.collection('bills');
    billCollection.add({
      ...newBill,
      creatorUid: userUid,
      items: {},
      users: { [userUid]: '' },
    });
  }
}
