import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { Bill, Item, NewBill, NewItemWithBill } from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillRTDBService {
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {}

  getAllBills() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.db
          .list<Bill>('bills', (ref) =>
            ref.orderByChild(`viewers/${user!.uid}`).equalTo(true)
          )
          .snapshotChanges()
      ),
      // add the key to the bill
      map((snapshotActionBills) => {
        return snapshotActionBills.map((bill) => {
          return {
            ...bill.payload.val()!,
            key: bill.key!,
          };
        });
      })
    );
  }

  getSingleBill(billId: string) {
    return this.db
      .object<Bill>(`bills/${billId}`)
      .snapshotChanges()
      .pipe(
        map((snapshotActionBill) => ({
          ...snapshotActionBill.payload.val()!,
          key: snapshotActionBill.key!,
        }))
      );
  }

  getItemsForBill(billId: string) {
    return this.db
      .list<Item>(`items/${billId}`)
      .snapshotChanges()
      .pipe(
        map((snapshotActionItems) =>
          snapshotActionItems.map((item) => ({
            ...item.payload.val()!,
            key: item.key!,
          }))
        )
      );
  }

  addBill(newBill: NewBill, userId: string) {
    const viewers: { [key: string]: boolean } = {};
    for (let viewer of newBill.viewers) {
      viewers[viewer] = true;
    }
    viewers[userId] = true;

    this.db.list('bills').push({
      name: newBill.name,
      creator: userId,
      friends: newBill.friends,
      viewers,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  addItem({ newItem, bill }: NewItemWithBill) {
    this.db.list(`items/${bill.key}`).push({
      ...newItem,
    });
  }
}
