import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
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
    items: this.fb.array([]),
  });

  get itemsForm() {
    return this.form.get('items') as FormArray;
  }

  sharedByForm(i: number) {
    return this.itemsForm.at(i).get('sharedBy') as FormArray;
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
    for (let i = 0; i < this.bill.items.length; i++) {
      const sharedByFormArray = this.fb.array([]);
      for (let j = 0; j < this.bill.items[i].sharedBy.length; j++) {
        const sharedByFormElement = this.fb.group({
          user: this.bill.items[i].sharedBy[j].user,
          settled: {
            value: this.bill.items[i].sharedBy[j].settled,
            disabled:
              this.bill.items[i].paidBy === this.bill.items[i].sharedBy[j].user,
          },
        });
        sharedByFormArray.push(sharedByFormElement);
      }

      const itemFormElement = this.fb.group({
        description: this.bill.items[i].description,
        sharedBy: sharedByFormArray,
        paidBy: this.bill.items[i].paidBy,
        cost: this.bill.items[i].cost,
      });
      this.itemsForm.push(itemFormElement);
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
