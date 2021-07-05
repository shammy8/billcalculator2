import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'bc-add-friends',
  template: `
    <form class="p-fluid" [formGroup]="form" (ngSubmit)="onAddFriends()">
      <div class="p-field">
        <label for="friends-input"
          >Friends' Name
          <button
            pButton
            icon="pi pi-info-circle"
            class="p-button-text p-button-md"
            style=" padding-bottom: 0"
            pTooltip="Name of your friends that will appear in this bill. Press enter after each name."
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
      <button
        pButton
        type="submit"
        [disabled]="form.get('friends')!.value.length === 0"
      >
        Add Friend{{ form.get('friends')!.value.length > 1 ? 's' : '' }}
      </button>
    </form>
  `,
  styles: [],
})
export class AddFriendsComponent {
  form = this.fb.group({
    friends: [[]],
  });

  @Output() addFriends = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  onAddFriends() {
    this.addFriends.emit(this.form.get('friends')?.value);
    this.form.reset({ friends: [] });
  }
}
