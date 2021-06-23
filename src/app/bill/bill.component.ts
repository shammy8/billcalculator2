import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { of, Subject } from 'rxjs';
import {
  debounceTime,
  groupBy,
  mergeMap,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {
  AddUsersEditorsWithBill,
  Bill,
  DeleteItem,
  ItemElement,
  Items,
  NewItemWithBill,
  SettledChange,
} from '../model/bill.model';

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

  sharedByForm(itemKey: string) {
    return this.itemsForm.get(`${itemKey}.sharedBy`) as FormGroup;
  }

  @Input() bill!: Bill;
  @Output() addItem = new EventEmitter<NewItemWithBill>();
  @Output() addUsersEditors = new EventEmitter<AddUsersEditorsWithBill>();
  @Output() itemsChanged = new EventEmitter<ItemElement[]>();
  @Output() onSettledChange = new EventEmitter<SettledChange>();
  @Output() onItemDelete = new EventEmitter<DeleteItem>();

  settledChange$ = new Subject<SettledChange>();

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
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.buildForm(this.bill.items);
    this.handleEmitSettledChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bill && !changes.bill.firstChange) {
      this.buildForm(changes.bill.currentValue.items);
    }
  }

  buildForm(items: Items) {
    this.itemsForm = this.fb.group({});

    for (let itemKey in items) {
      const itemFormElement = this.fb.group({
        description: '',
        paidBy: '',
        cost: '',
        date: null,
      });
      itemFormElement.patchValue({
        description: items[itemKey].description,
        paidBy: items[itemKey].paidBy,
        cost: items[itemKey].cost,
        date: items[itemKey].date,
      });

      const sharedByFormList = this.fb.group({});
      for (let sharedByKey in items[itemKey].sharedBy) {
        const sharedByFormElement = this.fb.group({
          user: '',
          settled: '',
        });
        sharedByFormElement.patchValue({
          user: items[itemKey].sharedBy[sharedByKey].user,
          settled: items[itemKey].sharedBy[sharedByKey].settled,
        });
        if (sharedByFormElement.get('user')?.value === items[itemKey].paidBy) {
          sharedByFormElement.get(`settled`)?.disable();
        }
        sharedByFormList.addControl(sharedByKey, sharedByFormElement);
      }
      itemFormElement.addControl('sharedBy', sharedByFormList);
      this.itemsForm.addControl(itemKey, itemFormElement);
    }
  }

  // private handleEmitItemsChanged() {
  //   this.itemsForm.valueChanges
  //     .pipe(takeUntil(this.destroy), debounceTime(2000)) // TODO? distinctUntilChanged(compareMethod) can pass in method to deep compare the object
  //     .subscribe(() => {
  //       this.itemsChanged.emit(this.itemsForm.getRawValue());
  //     });
  // }

  /**
   * All sharedBy share this method so need groupBy
   * TODO might be memory leak below need to check. takeUntil changing bills maybe?
   */
  handleEmitSettledChange() {
    this.settledChange$
      .pipe(
        takeUntil(this.destroy),
        groupBy((settleChanged) => settleChanged.sharedByKey),
        mergeMap((settledChangedGrouped) =>
          settledChangedGrouped.pipe(
            debounceTime(1000),
            // distinctUntilChanged((curr, prev) => curr.checked === prev.checked) // don't need this?
            switchMap((settleChanged) => {
              this.onSettledChange.emit(settleChanged);
              return of(settleChanged);
            })
          )
        )
      )
      .subscribe();
  }

  orderByDate(
    a: KeyValue<string, AbstractControl>,
    b: KeyValue<string, AbstractControl>
  ) {
    const valueA = a.value.value.date.seconds;
    const valueB = b.value.value.date.seconds;
    return valueA > valueB ? -1 : valueB > valueA ? 1 : 0;
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

  deleteItem({
    event,
    itemId,
    item,
  }: {
    event: MouseEvent;
    itemId: string;
    item: ItemElement;
  }) {
    this.confirmationService.confirm({
      target: event.target as undefined | EventTarget,
      message: `Are you sure you want to delete this item: ${item.description} £${item.cost}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onItemDelete.emit({ billId: this.bill.uid, itemId: itemId });
      },
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
