import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { nanoid } from 'nanoid';
import {
  AddUsersEditorsWithBill,
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
    const users: { [key: string]: string } = {};
    for (let editor in newBill.editorsArray) {
      users[newBill.editorsArray[editor]] = '';
    }
    users[userUid] = '';

    const billCollection = this.store.collection('bills');
    billCollection.add({
      name: newBill.name,
      usersArray: newBill.usersArray,
      creatorUid: userUid,
      items: {},
      users,
    });
  }

  /**
   * If user is adding more editors it will run a transaction as we need to check if the editor already exists in the map
   * If only users are to be added to usersArray then just run a normal update
   */
  addUsersEditors({ bill, usersAndEditors }: AddUsersEditorsWithBill) {
    if (usersAndEditors.editorsArray.length !== 0) {
      const docRef = this.store.firestore.doc(`bills/${bill.uid}`);
      this.store.firestore.runTransaction(async (transaction) => {
        const billDoc = await transaction.get(docRef);
        if (!billDoc.exists) {
          return;
        }
        const newUsers: { [key: string]: string } = billDoc.data()!.users;
        for (const user of usersAndEditors.editorsArray) {
          if (billDoc.data()!.users[user] == null) {
            newUsers[user] = '';
          }
        }
        transaction.update(docRef, {
          users: newUsers,
          usersArray: firebase.firestore.FieldValue.arrayUnion(
            ...usersAndEditors.usersArray
          ),
        });
      });
    } else {
      const doc = this.store.doc(`bills/${bill.uid}`);
      doc.update({
        usersArray: firebase.firestore.FieldValue.arrayUnion(
          ...usersAndEditors.usersArray
        ),
      });
    }
  }
}
