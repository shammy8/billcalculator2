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
        <span *ngIf="form.get('name')?.errors?.maxlength" class="p-error">
          Max of 20 characters
        </span>
      </div>
      <div class="p-field">
        <label for="friends-input" pTooltip="Enter your username"
          >Friends
          <button
            pButton
            type="button"
            icon="pi pi-info-circle"
            class="p-button-text p-button-md"
            style=" padding-bottom: 0"
            pTooltip="Name of your friends that will appear in this bill. Press enter after each name. You need to enter your own name too"
          ></button>
        </label>
        <p-chips
          id="friends-input"
          formControlName="friends"
          [allowDuplicate]="false"
          separator=","
          [addOnBlur]="true"
        ></p-chips>
      </div>
      <div class="p-field">
        <label for="editors-input"
          >Editors UID
          <button
            pButton
            type="button"
            icon="pi pi-info-circle"
            class="p-button-text p-button-md"
            style=" padding-bottom: 0"
            pTooltip="User id of the accounts that can view and edit this bill. Uid can be found in the side bar. Press enter after each uid. You don't need to enter your own uid."
          ></button>
        </label>
        <p-chips
          id="editors-input"
          formControlName="editors"
          [allowDuplicate]="false"
          separator=","
          [addOnBlur]="true"
        ></p-chips>
      </div>
      <button pButton type="submit" [disabled]="form.invalid">Add Bill</button>
    </form>

    <p-dialog
      header="Add Bill"
      [(visible)]="displayFriendsDialog"
      [style]="{ width: '100%' }"
      [modal]="true"
      [dismissableMask]="true"
      >Hi
    </p-dialog>
  `,
  styles: [],
})
export class AddBillComponent implements OnInit {
  displayFriendsDialog = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
    friends: [[], [Validators.required]],
    editors: [[]],
  });

  @Output() addBill = new EventEmitter<NewBill>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onAddBill() {
    this.form.get('name')?.getError('maxLength');
    this.addBill.emit(this.form.value);
    this.form.reset({ name: '', friends: [], editors: [] });
  }
}
