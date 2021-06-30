import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import {
  debounceTime,
  groupBy,
  map,
  mergeMap,
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
  NewItemWithBill,
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

  itemsForm = this.fb.group({});

  billId$ = this.route.paramMap.pipe(
    map((params) => {
      const billId = params.get('billId');
      if (!billId) {
        // TODO handle when no billId
        return null;
      }
      return billId;
    })
  );

  // TODO handle when not allowed or if doc doesn't exist
  billWithItems$ = this.billId$.pipe(
    mergeMap((billId) => {
      return combineLatest([
        // get Single bill will fire twice as it first gets it from the cache as I call get all bills in main component
        this.billService.getSingleBill(billId!),
        this.billService.getItemsForBill(billId!),
      ]);
    }),
    map(([bill, items]) => ({ ...bill!, items: items }))
  );

  itemsChange$ = new Subject<{ item: Item; billId: string }>();

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
        // this.onSetAsPrimaryBill.emit(this.bill.id);
      },
    },
    {
      label: 'Order by description',
      icon: 'pi pi-user-plus',
      command: (e) => {
        // this.order = (
        //   a: KeyValue<string, AbstractControl>,
        //   b: KeyValue<string, AbstractControl>
        // ) => {
        //   const valueA = a.value.value.date.seconds;
        //   const valueB = b.value.value.date.seconds;
        //   return valueA > valueB ? -1 : valueB > valueA ? 1 : 0;
        // };
      },
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

  buildForm(items: any) {
    // this.itemsForm = this.fb.group({});
    // for (let itemKey in items) {
    //   const itemFormElement = this.fb.group({
    //     description: '',
    //     paidBy: '',
    //     cost: '',
    //     date: null,
    //   });
    //   itemFormElement.patchValue({
    //     description: items[itemKey].description,
    //     paidBy: items[itemKey].paidBy,
    //     cost: items[itemKey].cost,
    //     date: items[itemKey].date,
    //   });
    //   const sharedByFormList = this.fb.group({});
    //   for (let sharedByKey in items[itemKey].sharedBy) {
    //     const sharedByFormElement = this.fb.group({
    //       user: '',
    //       settled: '',
    //     });
    //     sharedByFormElement.patchValue({
    //       user: items[itemKey].sharedBy[sharedByKey].user,
    //       settled: items[itemKey].sharedBy[sharedByKey].settled,
    //     });
    //     if (sharedByFormElement.get('user')?.value === items[itemKey].paidBy) {
    //       sharedByFormElement.get(`settled`)?.disable();
    //     }
    //     sharedByFormList.addControl(sharedByKey, sharedByFormElement);
    //   }
    //   itemFormElement.addControl('sharedBy', sharedByFormList);
    //   this.itemsForm.addControl(itemKey, itemFormElement);
    // }
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
          itemsChangedGrouped.pipe(debounceTime(1000))
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

  itemTrackBy(index: number, item: Item) {
    return item.id;
  }

  deleteItem({ item, billId }: { item: Item; billId: string }) {
    this.confirmationService.confirm({
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
