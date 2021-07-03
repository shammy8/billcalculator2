import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { combineLatest, of, Subject } from 'rxjs';
import {
  debounceTime,
  groupBy,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {
  AddUsersEditorsWithBill,
  Bill,
  BillWithId,
  DeleteItem,
  Item,
  ItemWithId,
} from '../model/bill.model';
import { ActivatedRoute } from '@angular/router';
import { BillService } from '../bill.service';

@Component({
  selector: 'bc-bill',
  templateUrl: 'bill.component.html',
  styleUrls: ['bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit, OnDestroy {
  displayAddItemDialog = false;
  displayAddUsersDialog = false;
  displayCalculateDialog = false;

  order: 'description' | 'cost' | 'date' = 'date';
  reverse = true;

  itemsForm = this.fb.group({});

  billId = '';
  billId$ = this.route.paramMap.pipe(
    map((params) => {
      const billId = params.get('billId');
      if (!billId) {
        // TODO handle when no billId
        return null;
      }
      this.billId = billId;
      return billId;
    })
  );

  // TODO handle when not allowed or if doc doesn't exist
  billWithItems$ = this.billId$.pipe(
    switchMap((billId) => {
      return combineLatest([
        this.billService.getSingleBill(billId!),
        this.billService.fetchItemsForBill(billId!),
      ]);
    }),
    map(([bill, items]) => ({ ...bill!, items: items }))
  );

  itemsChange$ = new Subject<{ item: ItemWithId; billId: string }>();

  destroy = new Subject<void>();

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
        this.billService.setAsPrimaryBill(this.billId);
      },
    },
    {
      label: 'Order alphabetically',
      icon: 'pi pi-sort-alpha-down',
      command: (e) => this.handleOrdering('description', false),
    },
    {
      label: 'Order by cost',
      icon: 'pi pi-sort-numeric-down',
      command: (e) => this.handleOrdering('cost', false),
    },
    {
      label: 'Order by date',
      icon: 'pi pi-sort-amount-down',
      command: (e) => this.handleOrdering('date'),
    },
    { label: 'Delete Bill', icon: 'pi pi-trash', command: (e) => {} },
  ];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    public billService: BillService
  ) {}

  ngOnInit(): void {
    // this.buildForm(this.bill.items);
    this.handleItemsChange();
  }

  /**
   * All items share this method so need groupBy
   * TODO might be memory leak below need to check. takeUntil changing bills maybe?
   */
  handleItemsChange() {
    this.itemsChange$
      .pipe(
        takeUntil(this.destroy),
        groupBy((itemsChanged) => itemsChanged.item.id),
        mergeMap((itemsChangedGrouped) =>
          itemsChangedGrouped.pipe(debounceTime(500))
        )
      )
      .subscribe(({ item, billId }) =>
        this.billService.itemChange(item, billId)
      );
  }

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

  itemTrackBy(index: number, item: ItemWithId) {
    return item.id;
  }

  handleOrdering(
    order: 'description' | 'cost' | 'date',
    reverseFirst: boolean = true
  ) {
    if (this.order === order) {
      this.reverse = !this.reverse;
    } else {
      this.order = order;
      this.reverse = reverseFirst;
    }
  }

  deleteItem({
    item,
    event,
    billId,
  }: {
    item: ItemWithId;
    event: MouseEvent;
    billId: string;
  }) {
    this.confirmationService.confirm({
      target: event?.target as undefined | EventTarget,
      message: `Are you sure you want to delete this item: ${item.description} £${item.cost}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.billService.deleteItem({
          itemId: item.id,
          billId,
        });
      },
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
