import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { nanoid } from 'nanoid';
import { ReplaySubject } from 'rxjs';
import { map, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  AddUsersEditorsWithBill,
  Bill,
  BillWithId,
  DeleteItem,
  Item,
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
        switchMap((user) =>
          this.store
            .collection<Bill>(`bills`, (ref) =>
              ref.where(`editors.${user!.uid}`, '==', true)
            )
            .valueChanges({ idField: 'id' })
        ),
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

  fetchItemsForBill(billId: string) {
    return this.store
      .collection<Item>(`bills/${billId}/items`)
      .valueChanges({ idField: 'id' })
      .pipe(tap((items) => console.log('READ items', items)));
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
    collection.add(newItem);
  }

  itemChange(item: Item, billId: string) {
    console.log('UPDATE item');
    const doc = this.store.doc<Item>(`bills/${billId}/items/${item.id}`);
    doc.update({
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
    const billCollection = this.store.collection('bills');
    billCollection.add({
      name: newBill.name,
      friends: newBill.friends,
      creator: userUid,
      editors,
    });
  }

  /**
   * If user is adding more editors it will run a transaction as we need to check if the editor already exists in the map
   * If only users are to be added to usersArray then just run a normal update
   */
  addUsersEditors({ bill, usersAndEditors }: AddUsersEditorsWithBill) {
    // if (usersAndEditors.editorsArray.length !== 0) {
    //   const docRef = this.store.firestore.doc(`bills/${bill.uid}`);
    //   this.store.firestore.runTransaction(async (transaction) => {
    //     const billDoc = await transaction.get(docRef);
    //     if (!billDoc.exists) {
    //       return;
    //     }
    //     const newUsers: { [key: string]: string } = billDoc.data()!.users;
    //     for (const user of usersAndEditors.editorsArray) {
    //       if (billDoc.data()!.users[user] == null) {
    //         newUsers[user] = '';
    //       }
    //     }
    //     transaction.update(docRef, {
    //       users: newUsers,
    //       usersArray: firebase.firestore.FieldValue.arrayUnion(
    //         ...usersAndEditors.usersArray
    //       ),
    //     });
    //   });
    // } else {
    //   const doc = this.store.doc(`bills/${bill.uid}`);
    //   doc.update({
    //     usersArray: firebase.firestore.FieldValue.arrayUnion(
    //       ...usersAndEditors.usersArray
    //     ),
    //   });
    // }
  }

  deleteItem({ billId, itemId }: DeleteItem) {
    // const doc = this.store.doc(`bills/${billId}`);
    // doc.update({ [`items.${itemId}`]: firebase.firestore.FieldValue.delete() });
  }

  setAsPrimaryBill(billId: string, uid: string) {
    // const doc = this.store.doc(`users/${uid}`);
    // doc.update({ primaryBill: billId });
  }
}
