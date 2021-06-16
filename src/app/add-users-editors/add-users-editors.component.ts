import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'bc-add-users-editors',
  template: `
    <form class="p-fluid" [formGroup]="form" (ngSubmit)="onAddUsers()">
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
      <button
        pButton
        type="submit"
        [disabled]="
          form.get('usersArray')!.value.length === 0 &&
          form.get('editorsArray')!.value.length === 0
        "
      >
        Add Users/Editors
      </button>
    </form>
  `,
  styles: [],
})
export class AddUsersEditorsComponent implements OnInit {
  form = this.fb.group({
    usersArray: [[]],
    editorsArray: [[]],
  });

  @Output() addUsersEditors = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onAddUsers() {
    this.addUsersEditors.emit(this.form.value);
    this.form.reset({ usersArray: [], editorsArray: [] });
  }
}
