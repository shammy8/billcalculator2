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
import { UserService } from '../user.service';

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

  user$ = this.auth.user;
  userDoc$: Observable<UserDoc | undefined> = of(undefined);

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private clipboard: Clipboard,
    private billRTDBService: BillRTDBService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // TODO need to handle when primaryBill hasn't been set yet
    this.userService.userObject$.subscribe((userObject) => {
      if (!userObject) return;
      this.router.navigate([userObject.primaryBill]);
    });
  }

  navigateToBill(bill: Bill) {
    this.router.navigate([bill.key]);
  }

  openAddBillDialog() {
    this.displayAddBillDialog = true;
  }

  closeAddBillDialog() {
    this.displayAddBillDialog = false;
  }

  copyUidToClipboard(uid: string) {
    this.clipboard.copy(uid);
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy() {}
}
