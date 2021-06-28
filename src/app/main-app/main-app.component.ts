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
  bills$ = this.billService.getBills();

  displaySidebar = false;
  displayAddBillDialog = false;

  user$ = this.auth.user;

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    public router: Router,
    public billService: BillService,
    public clipboard: Clipboard,
    private userService: UserService
  ) {}

  // TODO need to tidy everything in here
  ngOnInit(): void {
    this.userService.userDoc$.subscribe((userDoc) => {
      if (!userDoc) return;
      this.router.navigate([userDoc.primaryBill]);
    });
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
