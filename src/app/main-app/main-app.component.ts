import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
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
    <br />
    <ng-container *ngIf="bills$ | async as bills">
      <p-dropdown
        [options]="bills"
        optionLabel="name"
        [formControl]="selectedBill"
      >
        <ng-template let-item pTemplate="item"> {{ item.name }}</ng-template>
      </p-dropdown>
      <pre> {{ bills | json }}</pre>
    </ng-container>
  `,
  styles: [],
})
export class MainAppComponent implements OnInit {
  bills$: Observable<Bill[] | []> = of([]);
  selectedBill = new FormControl();

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
          .collection<Bill>('bills', (ref) => ref.orderBy(`users.${user?.uid}`))
          .valueChanges()
      )
    );

    this.selectedBill.valueChanges.subscribe(console.log);
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
