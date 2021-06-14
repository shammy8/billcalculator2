import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Bill, Item, NewItemWithBill, SettledChange } from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(private store: AngularFirestore) {}

  addItem(newItemWithBill: NewItemWithBill) {
    console.log(newItemWithBill);
    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
    const doc = this.store.doc<Bill>(`bills/${newItemWithBill.bill.uid}`);
    doc.update({ items: arrayUnion(newItemWithBill.newItem) as any }); // TODO can't get it to work without the as any
  }

  settledChanged(settleChange: SettledChange) {
    const doc = this.store.doc<Bill>(`bills/${settleChange.billId}`);
    doc.update({
      [`items.${settleChange.itemKey}.sharedBy.${settleChange.sharedByKey}.settled`]:
        settleChange.checked,
    });
  }
}
