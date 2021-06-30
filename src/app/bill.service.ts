import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { nanoid } from 'nanoid';
import { share, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  AddUsersEditorsWithBill,
  Bill,
  DeleteItem,
  Item,
  Items,
  NewBill,
  NewItemWithBill,
} from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {}

  getBills() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.store
          .collection<Bill>(`bills`, (ref) =>
            ref.where(`editors.${user!.uid}`, '==', true)
          )
          .valueChanges({ idField: 'id' })
      ),
      tap((bills) => console.log('getBills', bills))
      // shareReplay()
    );
  }

  getSingleBill(billId: string) {
    return this.store
      .doc<Bill>(`bills/${billId}`)
      .valueChanges({ idField: 'id' })
      .pipe(tap((bill) => console.log('get single bill', bill)));
  }

  getItemsForBill(billId: string) {
    return this.store
      .collection<Item>(`bills/${billId}/items`)
      .valueChanges({ idField: 'id' })
      .pipe(tap((items) => console.log('get items', items)));
  }

  addItem(newItemWithBill: NewItemWithBill) {
    // const doc = this.store.doc<Bill>(`bills/${newItemWithBill.bill.uid}`);
    // doc.update({
    //   [`items.${nanoid(8)}`]: newItemWithBill.newItem,
    // });
  }

  itemChange(item: Item, billId: string) {
    const doc = this.store.doc<Item>(`bills/${billId}/items/${item.id}`);
    doc.update({
      sharedBy: item.sharedBy,
    });
  }

  addBill(newBill: NewBill, userUid: string) {
    // const users: { [key: string]: string } = {};
    // for (let editor in newBill.editorsArray) {
    //   users[newBill.editorsArray[editor]] = '';
    // }
    // users[userUid] = '';
    // const billCollection = this.store.collection('bills');
    // billCollection.add({
    //   name: newBill.name,
    //   usersArray: newBill.usersArray,
    //   creatorUid: userUid,
    //   items: {},
    //   users,
    // });
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
