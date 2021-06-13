import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Bill, Item, NewItemWithBill } from '../model/bill.model';

@Component({
  selector: 'bc-bill',
  templateUrl: 'bill.component.html',
  styleUrls: ['bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit {
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
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
      });
      this.itemsForm.push(itemFormElement);
    }
  }

  openAddItemDialog() {
    this.displayAddItemDialog = true;
  }

  closeAddItemDialog() {
    this.displayAddItemDialog = false;
  }
}
