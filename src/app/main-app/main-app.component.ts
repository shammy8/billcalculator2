import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BillService } from '../bill.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { UserService } from '../user.service';
import { NewBill } from '../model/bill.model';
import { ConfirmationService } from 'primeng/api';

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
    private userService: UserService,
    private confirmService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.userService.userDoc$
      .pipe(takeUntil(this.destroy))
      .subscribe((userDoc) => {
        if (!userDoc?.primaryBill) return;
        this.router.navigate([userDoc.primaryBill]);
      });

    this.billService.fetchBills();
  }

  closeSideBar() {
    this.displaySidebar = false;
  }

  openAddBillDialog() {
    this.displayAddBillDialog = true;
  }

  closeAddBillDialog() {
    this.displayAddBillDialog = false;
  }

  async addBill(newBill: NewBill, userId: string) {
    this.closeAddBillDialog();
    this.closeSideBar();
    const doc = await this.billService.addBill(newBill, userId);
    this.router.navigate([doc.id]);
  }

  signOut(event: MouseEvent) {
    this.user$.pipe(take(1)).subscribe((user) => {
      const message = user?.isAnonymous
        ? 'You are logged in anonymously, your data will be lost if you log out. Are you sure you want to log out?'
        : 'Are you sure you want to log out?';
      this.confirmService.confirm({
        target: event.target as undefined | EventTarget,
        message,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.auth.signOut().then(() => {
            this.router.navigate(['login']);
          });
        },
      });
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
