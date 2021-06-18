import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NewBill } from '../model/bill.model';

@Component({
  selector: 'bc-add-bill',
  template: `
    <form class="p-fluid" [formGroup]="form" (ngSubmit)="onAddBill()">
      <div class="p-field">
        <label for="name-input">Name</label>
        <input id="name-input" pInputText autofocus formControlName="name" />
      </div>
      <div class="p-field">
        <label for="users-input">Users Display Name</label>
        <p-chips
          id="users-input"
          formControlName="usersArray"
          [allowDuplicate]="false"
          separator=","
        ></p-chips>
      </div>
      <div class="p-field">
        <label for="editors-input">Editors UID</label>
        <p-chips
          id="editors-input"
          formControlName="editorsArray"
          [allowDuplicate]="false"
          separator=","
        ></p-chips>
      </div>
      <button pButton type="submit" [disabled]="form.invalid">Add Bill</button>
    </form>
  `,
  styles: [],
})
export class AddBillComponent implements OnInit {
  form = this.fb.group({
    name: ['', [Validators.required]],
    usersArray: [[], [Validators.required]],
    editorsArray: [[]],
  });

  @Output() addBill = new EventEmitter<NewBill>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onAddBill() {
    this.addBill.emit(this.form.value);
    this.form.reset({ name: '', usersArray: [], editorsArray: [] });
  }
}
