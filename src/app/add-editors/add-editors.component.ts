import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'bc-add-editors',
  template: `
    <form class="p-fluid" [formGroup]="form" (ngSubmit)="onAddEditors()">
      <div class="p-field">
        <label for="editors-input"
          >Editors' UID
          <button
            pButton
            icon="pi pi-info-circle"
            class="p-button-text p-button-md"
            style=" padding-bottom: 0"
            pTooltip="User id of the accounts that can view and edit this bill. Uid can be found in the side bar. Press enter after each uid."
          ></button>
        </label>
        <p-chips
          id="editors-input"
          formControlName="editorsArray"
          [allowDuplicate]="false"
          separator=","
          [addOnBlur]="true"
        ></p-chips>
      </div>
      <button
        pButton
        type="submit"
        [disabled]="form.get('editorsArray')!.value.length === 0"
      >
        Add Editor{{ form.get('editorsArray')!.value.length > 1 ? 's' : '' }}
      </button>
    </form>
  `,
  styles: [],
})
export class AddEditorsComponent {
  form = this.fb.group({
    editorsArray: [[]],
  });

  @Output() addEditors = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  onAddEditors() {
    this.addEditors.emit(this.form.get('editorsArray')?.value);
    this.form.reset({ editorsArray: [] });
  }
}
