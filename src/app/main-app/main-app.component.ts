import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Bill } from '../model/bill.model';

@Component({
  selector: 'bc-main-app',
  template: `
    <button
      type="button"
      pButton
      label="Sign out"
      icon="pi pi-sign-out"
      iconPos="left"
      (click)="signOut()"
    ></button>
    <p>main-app works!</p>
  `,
  styles: [],
})
export class MainAppComponent implements OnInit {
  bills$: Observable<Bill[] | []> = of([]);

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bills$ = this.auth.user.pipe(
      switchMap((user) =>
        this.store
          // only return documents with a users.userid field where userid is the uid of the currently signed in user
          .collection<Bill>('bill', (ref) => ref.orderBy(`users.${user?.uid}`))
          .valueChanges()
      )
    );
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
