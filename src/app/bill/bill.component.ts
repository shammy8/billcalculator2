import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Bill, Item, NewItemWithBill } from '../model/bill.model';

@Component({
  selector: 'bc-bill',
  templateUrl: 'bill.component.html',
  styleUrls: ['bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit, OnDestroy {
  displayAddItemDialog = false;

  form = this.fb.group({
    items: this.fb.group({}),
  });

  get itemsForm() {
    return this.form.get('items') as FormGroup;
  }

  sharedByForm(itemKey: string) {
    return (this.itemsForm.get(itemKey) as FormGroup).get(
      'sharedByList'
    ) as FormGroup;
  }

  @Input() bill!: Bill;
  @Output() addItem = new EventEmitter<NewItemWithBill>();
  @Output() itemsChanged = new EventEmitter<Item[]>();

  destroy = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.handleEmitItemsChanged();
  }

  buildForm() {
    for (let itemKey in this.bill.items) {
      const sharedByFormList = this.fb.group({});
      for (let sharedByKey in this.bill.items[itemKey].sharedBy) {
        const sharedByFormElement = this.fb.group({
          user: this.bill.items[itemKey].sharedBy[sharedByKey].user,
          settled: {
            value: this.bill.items[itemKey].sharedBy[sharedByKey].settled,
            disabled:
              this.bill.items[itemKey].paidBy ===
              this.bill.items[itemKey].sharedBy[sharedByKey].user,
          },
        });
        sharedByFormList.addControl(sharedByKey, sharedByFormElement);
      }

      const itemFormElement = this.fb.group({
        description: this.bill.items[itemKey].description,
        sharedByList: sharedByFormList,
        paidBy: this.bill.items[itemKey].paidBy,
        cost: this.bill.items[itemKey].cost,
      });
      this.itemsForm.addControl(itemKey, itemFormElement);
    }
  }

  private handleEmitItemsChanged() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy), debounceTime(2000)) // TODO? distinctUntilChanged(compareMethod) can pass in method to deep compare the object
      .subscribe(() => {
        this.itemsChanged.emit(this.form.getRawValue().items);
      });
  }

  openAddItemDialog() {
    this.displayAddItemDialog = true;
  }

  closeAddItemDialog() {
    this.displayAddItemDialog = false;
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
