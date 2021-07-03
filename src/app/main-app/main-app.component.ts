import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  bills$ = this.billService.bills$;

  displaySidebar = false;
  displayAddBillDialog = false;

  user$ = this.auth.user;

  destroy = new Subject<void>();

  constructor(
    private auth: AngularFireAuth,
    public router: Router,
    public billService: BillService,
    public clipboard: Clipboard,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.userDoc$
      .pipe(takeUntil(this.destroy))
      .subscribe((userDoc) => {
        if (!userDoc) return;
        this.router.navigate([userDoc.primaryBill]);
      });

    this.billService.fetchBills();
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

  ngOnDestroy() {
    this.destroy.next();
  }
}
