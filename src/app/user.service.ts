import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { shareReplay, switchMap } from 'rxjs/operators';
import { UserObject } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userObject$ = this.auth.user.pipe(
    switchMap((user) =>
      this.db.object<UserObject>(`users/${user?.uid}`).valueChanges()
    ),
    shareReplay()
  );

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {}
}
