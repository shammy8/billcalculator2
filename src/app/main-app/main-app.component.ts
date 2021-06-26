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
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, share, switchMap, take, tap } from 'rxjs/operators';
import { Bill } from '../model/bill.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { UserDoc } from '../model/user.model';
import { BillRTDBService } from '../bill-rtdb.service';

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
  bills$ = this.billRTDBService.getAllBills();

  selectedBill$: Observable<Bill> | undefined;
  selectedBillControl = new FormControl();

  displaySidebar = false;
  displayAddBillDialog = false;

  user: firebase.User | null = null;
  user$!: Observable<firebase.User | null>;
  userDoc$: Observable<UserDoc | undefined> = of(undefined);

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private clipboard: Clipboard,
    private billRTDBService: BillRTDBService
  ) {}

  ngOnInit(): void {}

  navigateToBill(bill: Bill) {
    this.router.navigate([bill.key]);
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
