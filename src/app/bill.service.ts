import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
// import 'firebase/firestore';
import { Bill, Item, NewItemWithBill } from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(private store: AngularFirestore) {}

  addItem(newItemWithBill: NewItemWithBill) {
    console.log(newItemWithBill);
    const arrayUnion = firebase.default.firestore.FieldValue.arrayUnion; // TODO why do we need default, other examples don't have it
    const doc = this.store.doc<Bill>(`bills/${newItemWithBill.bill.uid}`);
    doc.update({ items: arrayUnion(newItemWithBill.newItem) as any }); // TODO can't get it to work without the as any
  }

  itemChanged(newItems: Item[]) {
    console.log(newItems);
  }
}
