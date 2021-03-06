import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { EMPTY, Observable, ReplaySubject } from 'rxjs';
import { auditTime, map, switchMap, take, tap } from 'rxjs/operators';
import {
  Bill,
  BillWithId,
  DeleteItem,
  Item,
  ItemWithId,
  NewBill,
} from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private billsRS = new ReplaySubject<BillWithId[]>(1);
  bills$ = this.billsRS.asObservable();

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {}

  fetchBills() {
    this.auth.user
      .pipe(
        switchMap((user) => {
          if (!user) return EMPTY;
          return this.store
            .collection<Bill>(`bills`, (ref) =>
              ref.where(`editors.${user.uid}`, '==', true)
            )
            .valueChanges({ idField: 'id' });
        }),
        tap((bills) => console.log('READ Bills', bills))
      )
      .subscribe((bills) => this.billsRS.next(bills));
  }

  getSingleBill(billId: string) {
    return this.bills$.pipe(
      map((bills) => {
        return bills.find((bill) => bill.id === billId);
      })
    );
  }

  // TODO changing bills or loading first bill will still wait the 800ms in the auditTime below.
  fetchItemsForBill(billId: string): Observable<ItemWithId[]> {
    return this.store
      .collection<Item>(`bills/${billId}/items`)
      .valueChanges({ idField: 'id' })
      .pipe(
        // auditTime(800),
        tap((items) => console.log('READ items', items))
      );
  }

  // fetchItemsForBillStateChanges(billId: string) {
  //   return this.store
  //     .collection<Item>(`bills/${billId}/items`)
  //     .stateChanges()
  //     .pipe(tap((items) => console.log('get items state change', items)));
  // }

  addItem(newItem: Item, billId: string) {
    console.log('CREATE ITEM');
    const collection = this.store.collection<Item>(`bills/${billId}/items`);
    collection.add({ ...newItem, cost: +newItem.cost });
  }

  itemChange(item: ItemWithId, billId: string) {
    console.log('UPDATE item');
    const doc = this.store.doc<Item>(`bills/${billId}/items/${item.id}`);
    doc.update({
      description: item.description,
      cost: item.cost,
      sharedBy: item.sharedBy,
    });
  }

  addBill(newBill: NewBill, userUid: string) {
    console.log('CREATE BILL');
    const editors: { [key: string]: boolean } = {};
    for (let editor in newBill.editors) {
      editors[newBill.editors[editor]] = true;
    }
    editors[userUid] = true;
    const billCollection = this.store.collection<Bill>('bills');
    return billCollection.add({
      name: newBill.name,
      friends: newBill.friends,
      creator: userUid,
      editors,
    });
  }

  addEditors(
    newEditorsArray: string[],
    billId: string,
    editors: { [key: string]: boolean }
  ) {
    console.log('UPDATE editors in bill');
    for (const editor of newEditorsArray) {
      editors[editor] = true;
    }
    const doc = this.store.firestore.doc(`bills/${billId}`);
    doc.update({ editors });
  }

  addFriends(friends: string[], billId: string) {
    console.log('UPDATE friends in bill');
    const doc = this.store.doc(`bills/${billId}`);
    doc.update({
      friends: firebase.firestore.FieldValue.arrayUnion(...friends),
    });
  }

  deleteItem({ billId, itemId }: DeleteItem) {
    const doc = this.store.doc(`bills/${billId}/items/${itemId}`);
    doc.delete();
  }

  setAsPrimaryBill(billId: string) {
    this.auth.user.pipe(take(1)).subscribe((user) => {
      const doc = this.store.doc(`users/${user!.uid}`);
      doc.update({ primaryBill: billId });
    });
  }
}
