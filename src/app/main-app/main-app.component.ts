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
import { combineLatest, Observable } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { BillService } from '../bill.service';
import { Bill } from '../model/bill.model';

@Component({
  selector: 'bc-main-app',
  template: `
    <ng-container *ngIf="bills$ | async as bills">
      <p-dropdown
        [options]="bills"
        optionLabel="name"
        optionValue="name"
        [formControl]="selectedBillControl"
        placeholder="Select a bill"
      >
        <ng-template let-item pTemplate="item"> {{ item.name }}</ng-template>
      </p-dropdown>
    </ng-container>

    <button
      type="button"
      pButton
      icon="pi pi-sign-out"
      iconPos="left"
      (click)="signOut()"
    ></button>
    <br />

    <bc-bill
      *ngIf="selectedBill$ | async as selectedBill"
      [bill]="selectedBill"
      (addItem)="this.billService.addItem($event)"
      (itemsChanged)="this.billService.itemChanged($event)"
    ></bc-bill>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainAppComponent implements OnInit, OnDestroy {
  bills$: Observable<Bill[]> | undefined;
  selectedBill$: Observable<Bill> | undefined;
  selectedBillControl = new FormControl();

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router,
    public billService: BillService
  ) {}

  ngOnInit(): void {
    this.bills$ = this.auth.user.pipe(
      switchMap((user) =>
        this.store
          // only return documents with a users.userid field where userid is the uid of the currently signed in user
          .collection<Bill>('bills', (ref) => ref.orderBy(`users.${user?.uid}`))
          .valueChanges({ idField: 'uid' })
      ),
      tap((bills) => this.selectedBillControl.setValue(bills[0].name)),
      share()
    );

    this.selectedBill$ = combineLatest([
      this.bills$,
      this.selectedBillControl.valueChanges,
    ]).pipe(
      map(
        ([bills, selectedBillName]) =>
          bills.find((bill) => bill.name === selectedBillName)!
      )
    );
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy() {}
}
