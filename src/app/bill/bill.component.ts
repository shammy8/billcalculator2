import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  groupBy,
  map,
  mergeMap,
  share,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {
  AddUsersEditorsWithBill,
  Bill,
  DeleteItem,
  Item,
  // ItemElement,
  // Items,
  // NewItemWithBill,
  SettledChange,
} from '../model/bill.model';
import { ActivatedRoute } from '@angular/router';
import { BillRTDBService } from '../bill-rtdb.service';

@Component({
  selector: 'bc-bill',
  templateUrl: 'bill.component.html',
  styleUrls: ['bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit, OnDestroy {
  items$: Observable<Item[]> = of([]);
  bill$: Observable<Bill | null> = of();
  billId$: Observable<string | null> = of(null);
  // TODO fix typings
  billWithItems$: Observable<{
    items: Item[];
    key?: string;
    name?: string | undefined;
    viewers?: { [key: string]: boolean } | undefined;
    friends?: string[];
    creator?: string | undefined;
  } | null> = of(null);

  displayAddItemDialog = false;
  displayAddUsersDialog = false;
  displayCalculateDialog = false;

  // @Output() addItem = new EventEmitter<NewItemWithBill>();
  // @Output() addUsersEditors = new EventEmitter<AddUsersEditorsWithBill>();
  // @Output() itemsChanged = new EventEmitter<ItemElement[]>();
  // @Output() onSettledChange = new EventEmitter<SettledChange>();
  @Output() onItemDelete = new EventEmitter<DeleteItem>();
  @Output() onSetAsPrimaryBill = new EventEmitter<string>();

  settledChange$ = new Subject<SettledChange>();
  // destroy = new Subject<void>();

  orderBy: 'cost' | 'description' | 'paidBy' = 'description';
  reverseOrder = false;

  menuItems: MenuItem[] = [
    {
      label: 'Calculate',
      icon: 'pi pi-wallet',
      command: (e) => {
        this.openCalculateDialog();
      },
    },
    {
      label: 'Add users and editors',
      icon: 'pi pi-user-plus',
      command: (e) => {
        this.openAddUsersDialog();
      },
    },
    {
      label: 'Set as primary bill',
      icon: 'pi pi-bookmark',
      command: (e) => {
        // this.onSetAsPrimaryBill.emit(this.bill.key);
      },
    },
    {
      label: 'Order alphabetically',
      icon: 'pi pi-sort-alpha-up',
      command: (e) => {
        if (this.orderBy === 'description') {
          this.reverseOrder = !this.reverseOrder;
        } else {
          this.orderBy = 'description';
        }
      },
    },
    {
      label: 'Order by cost',
      icon: 'pi pi-sort-numeric-up',
      command: (e) => {
        if (this.orderBy === 'cost') {
          this.reverseOrder = !this.reverseOrder;
        } else {
          this.orderBy = 'cost';
        }
      },
    },
    // {
    //   label: 'Order by payer',
    //   icon: 'pi pi-user-plus',
    //   command: (e) => {
    //     if (this.orderBy === 'paidBy') {
    //       this.reverseOrder = !this.reverseOrder;
    //     } else {
    //       this.orderBy = 'paidBy';
    //     }
    //   },
    // },
    { label: 'Delete Bill', icon: 'pi pi-trash', command: (e) => {} },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    public billRTDBService: BillRTDBService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.billId$ = this.route.paramMap.pipe(
      map((params) => params.get('billId'))
    );

    this.items$ = this.billId$.pipe(
      switchMap((billId) => this.billRTDBService.getItemsForBill(billId!))
    );

    this.bill$ = this.billId$.pipe(
      switchMap((billId) => this.billRTDBService.getSingleBill(billId!))
    );

    this.billWithItems$ = combineLatest([this.items$, this.bill$]).pipe(
      map(([items, bill]) => ({ ...bill, items: items }))
    );
  }

  // /**
  //  * All sharedBy share this method so need groupBy
  //  * TODO might be memory leak below need to check. takeUntil changing bills maybe?
  //  */
  // handleEmitSettledChange() {
  //   this.settledChange$
  //     .pipe(
  //       takeUntil(this.destroy),
  //       groupBy((settleChanged) => settleChanged.sharedByKey),
  //       mergeMap((settledChangedGrouped) =>
  //         settledChangedGrouped.pipe(
  //           debounceTime(100),
  //           // distinctUntilChanged((curr, prev) => curr.checked === prev.checked) // don't need this?
  //           switchMap((settleChanged) => {
  //             this.onSettledChange.emit(settleChanged);
  //             return of(settleChanged);
  //           })
  //         )
  //       )
  //     )
  //     .subscribe();
  // }

  openAddItemDialog() {
    this.displayAddItemDialog = true;
  }

  closeAddItemDialog() {
    this.displayAddItemDialog = false;
  }

  openAddUsersDialog() {
    this.displayAddUsersDialog = true;
  }

  closeAddUsersDialog() {
    this.displayAddUsersDialog = false;
  }

  openCalculateDialog() {
    this.displayCalculateDialog = true;
  }

  deleteItem({
    event,
    itemId,
    item,
  }: {
    event: MouseEvent;
    itemId: string;
    item: Item;
  }) {
    this.confirmationService.confirm({
      target: event.target as undefined | EventTarget,
      message: `Are you sure you want to delete this item: ${item.description} £${item.cost}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.onItemDelete.emit({ billId: this.bill.uid, itemId: itemId });
      },
    });
  }

  ngOnDestroy() {
    //   this.destroy.next();
  }
}
