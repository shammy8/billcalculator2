import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
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

    <p-dropdown
      [options]="bills"
      optionLabel="name"
      optionValue="name"
      [formControl]="selectedBillControl"
      placeholder="Select a bill"
    >
      <ng-template let-item pTemplate="item"> {{ item.name }}</ng-template>
    </p-dropdown>

    <bc-bill *ngIf="selectedBill" [bill]="selectedBill"></bc-bill>
  `,
  styles: [],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainAppComponent implements OnInit, OnDestroy {
  bills: Bill[] = [];
  selectedBill: Bill | null = null;
  selectedBillControl = new FormControl();

  private readonly onDestroy = new Subject<void>();

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user
      .pipe(
        takeUntil(this.onDestroy),
        switchMap((user) =>
          this.store
            // only return documents with a users.userid field where userid is the uid of the currently signed in user
            .collection<Bill>('bills', (ref) =>
              ref.orderBy(`users.${user?.uid}`)
            )
            .valueChanges()
        )
      )
      .subscribe((bills) => (this.bills = bills));

    this.selectedBillControl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((billName) => {
        this.selectedBill = this.bills.find((bill) => bill.name === billName)!;
      });
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
