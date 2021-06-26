import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap } from 'rxjs/operators';
import { Bill, Item } from './model/bill.model';

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
          .valueChanges()
      )
    );
  }

  getItemsForBill(billId: string) {
    return this.db.list<Item[]>(`items/${billId}`).valueChanges();
  }
}
