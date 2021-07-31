import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { EMPTY } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { UserDoc } from './model/bill.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userDoc$ = this.auth.user.pipe(
    switchMap((user) => {
      if (!user) return EMPTY;
      return this.store.doc<UserDoc>(`users/${user.uid}`).valueChanges();
    }),
    tap((userDoc) => console.log('userDoc$', userDoc)),
    shareReplay()
  );

  constructor(private auth: AngularFireAuth, private store: AngularFirestore) {}
}
