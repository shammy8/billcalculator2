import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nanoid } from 'nanoid';
import { ItemElement, SharedByElement } from '../model/bill.model';

@Component({
  selector: 'bc-add-item',
  template: `
    <form class="p-fluid" [formGroup]="form" (ngSubmit)="onAddItem()">
      <div class="p-field">
        <label for="description-input">Description</label>
        <input
          id="description-input"
          pInputText
          autofocus
          formControlName="description"
        />
      </div>
      <div class="p-field">
        <label for="cost-input">Cost</label> &nbsp;
        <span class="p-text-light" style="font-size: 0.8rem"
          >Try simple maths like "=(10/2)+1"</span
        >
        <input
          id="cost-input"
          (keyup.enter)="calculateCost($event)"
          (blur)="calculateCost($event)"
          formControlName="cost"
          pInputText
        />
      </div>
      <!-- <div class="p-field">
        <label for="cost-input">Cost</label>
        <p-inputNumber
          id="cost-input"
          formControlName="cost"
          mode="currency"
          currency="GBP"
          [max]="1000000"
          type="number"
        ></p-inputNumber>
      </div> -->
      <div class="p-field">
        <label for="paidBy-input">Paid by</label>
        <p-dropdown
          id="paidBy-input"
          [options]="users"
          appendTo="body"
          formControlName="paidBy"
          placeholder="Select the payer"
        ></p-dropdown>
      </div>
      <div class="p-field">
        <label for="sharedBy-input">Shared by</label>
        <p-multiSelect
          id="sharedBy-input"
          [options]="users"
          appendTo="body"
          formControlName="sharedBy"
          placeholder="Select who are to pay for this item"
          [filter]="false"
        ></p-multiSelect>
      </div>
      <div class="p-field">
        <label for="date-input">Date</label>
        <p-calendar
          id="date-input"
          appendTo="body"
          formControlName="date"
          dateFormat="dd/mm/yy"
        ></p-calendar>
      </div>
      <button type="submit" pButton [disabled]="form.invalid">Add Item</button>
    </form>
  `,
  styles: [],
})
export class AddItemComponent implements OnInit {
  @Input() users!: string[];
  @Output() addItem = new EventEmitter<ItemElement>();

  form = this.fb.group({
    description: ['', [Validators.required]],
    // cost: [0.0, [Validators.required]],
    cost: [
      0.0, // add validation for it being a number and only 2 decimal places
      [Validators.required, Validators.max(1000000), Validators.min(0)],
    ],
    paidBy: ['', [Validators.required]],
    sharedBy: [[], [Validators.required]],
    date: [new Date(), [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  calculateCost(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // TODO add validation to only eval when all digits are numbers, +,-,*,/,( or )
    if (value[0] !== '=') return;
    const calculatedCost = eval(value.substring(1));
    if (value[0] !== '=') return;
    if (typeof calculatedCost === 'number') {
      this.form.get('cost')?.patchValue(calculatedCost);
    } else {
      this.form.get('cost')?.patchValue('');
    }
  }

  onAddItem() {
    const sharedByInCorrectFormat: { [key: string]: SharedByElement } = {};
    this.form.get('sharedBy')?.value.forEach((user: string) => {
      sharedByInCorrectFormat[nanoid(6)] = {
        user: user,
        settled: this.form.get('paidBy')?.value === user,
      };
    });
    this.addItem.emit({
      ...this.form.value,
      sharedBy: sharedByInCorrectFormat,
    });
    this.form.reset({ cost: 0.0, date: new Date() });
  }
}
