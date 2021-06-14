import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { nanoid } from 'nanoid';
import { Bill, NewItemWithBill, SettledChange } from './model/bill.model';

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
}
