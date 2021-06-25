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
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, share, switchMap, take, tap } from 'rxjs/operators';
import { BillService } from '../bill.service';
import { Bill } from '../model/bill.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { UserDoc } from '../model/user.model';

@Component({
  selector: 'bc-main-app',
  templateUrl: 'main-app.component.html',
  styles: [
    `
      :host ::ng-deep .p-sidebar-content {
        display: flex;
        flex-direction: column;
      }
      :host ::ng-deep .p-button-label {
        text-align: left;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainAppComponent implements OnInit, OnDestroy {
  bills$: Observable<Bill[]> | undefined;
  selectedBill$: Observable<Bill> | undefined;
  selectedBillControl = new FormControl();

  displaySidebar = false;
  displayAddBillDialog = false;

  user: firebase.User | null = null;
  user$!: Observable<firebase.User | null>;
  userDoc$: Observable<UserDoc | undefined> = of(undefined);

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router,
    public billService: BillService,
    private clipboard: Clipboard
  ) {}

  // TODO need to tidy everything in here
  ngOnInit(): void {
    this.user$ = this.auth.user.pipe(
      filter((user) => user != null),
      tap((user) => (this.user = user))
    );

    // get all bills for user
    this.bills$ = this.user$.pipe(
      switchMap((user) =>
        this.store
          // only return documents with a users.userid field where userid is the uid of the currently signed in user
          .collection<Bill>('bills', (ref) =>
            ref.where(`users.${user!.uid}`, '!=', null)
          )
          .valueChanges({ idField: 'uid' })
      ),
      share()
    );

    // get user doc for user
    this.userDoc$ = this.auth.user.pipe(
      switchMap((user) =>
        this.store.doc<UserDoc>(`users/${user!.uid}`).valueChanges()
      )
    );

    // set the first bill to be display
    combineLatest([this.userDoc$, this.bills$])
      .pipe(take(2)) // firebase persistence will load from cache first before loading from firestore
      .subscribe(([userDoc, bills]) => {
        if (userDoc?.primaryBill) {
          const primaryBill = bills.find(
            (bill) => bill.uid === userDoc.primaryBill
          );
          this.selectedBillControl.setValue(primaryBill!.name);
        } else {
          this.selectedBillControl.setValue(bills[0]?.name);
        }
      });

    // handle changing bill
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

  copyUidToClipboard() {
    this.clipboard.copy(this.user!.uid);
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy() {}
}
