import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bc-no-bill',
  template: `
    <div class="header">
      <span class="bill-name"> Select a bill </span>
      <p-splitButton
        label="Add item"
        icon="pi pi-plus"
        appendTo="body"
        [disabled]="true"
      ></p-splitButton>
      <!-- [model]="menuItems"
        (onClick)="openAddItemDialog()" -->
    </div>
    <div class="items">
      <p style="font-size: 1.2rem">
        Please select a bill or add a new bill from the side menu.
      </p>
    </div>
  `,
  styleUrls: ['../bill/bill.component.scss'], // shares a stylesheet with bill component
})
export class NoBillComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
