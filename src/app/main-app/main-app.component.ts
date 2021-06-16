import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, share, switchMap, take, tap } from 'rxjs/operators';
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
      label="Add Bill"
      (click)="openAddBillDialog()"
    ></button>
    <button
      type="button"
      class="p-button-warning"
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
      (onSettledChange)="this.billService.settledChanged($event)"
    ></bc-bill>

    <p-dialog
      header="Add Bill"
      [(visible)]="displayAddBillDialog"
      [style]="{ width: '100%' }"
    >
      <bc-add-bill
        (addBill)="
          this.billService.addBill($event, user!.uid); closeAddBillDialog()
        "
      ></bc-add-bill>
    </p-dialog>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainAppComponent implements OnInit, OnDestroy {
  bills$: Observable<Bill[]> | undefined;
  selectedBill$: Observable<Bill> | undefined;
  selectedBillControl = new FormControl();

  displayAddBillDialog = false;
  user: firebase.User | null = null;

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router,
    public billService: BillService
  ) {}

  ngOnInit(): void {
    this.bills$ = this.auth.user.pipe(
      tap((user) => (this.user = user)),
      switchMap((user) =>
        this.store
          // only return documents with a users.userid field where userid is the uid of the currently signed in user
          .collection<Bill>('bills', (ref) => ref.orderBy(`users.${user?.uid}`))
          .valueChanges({ idField: 'uid' })
      ),
      share()
    );

    this.bills$
      .pipe(take(1))
      .subscribe((bills) => this.selectedBillControl.setValue(bills[0].name));

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

  openAddBillDialog() {
    this.displayAddBillDialog = true;
  }

  closeAddBillDialog() {
    this.displayAddBillDialog = false;
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy() {}
}
