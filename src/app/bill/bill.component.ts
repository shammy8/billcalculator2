import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Bill } from '../model/bill.model';

@Component({
  selector: 'bc-bill',
  template: `
    <button
      pButton
      class="p-button-rounded"
      icon="pi pi-plus"
      (click)="addItem()"
    ></button>
    <p-dataView [value]="bill.items">
      <ng-template pTemplate="header">Items</ng-template>
      <ng-template let-item pTemplate="listItem">
        <div class="p-col-12">
          {{ item.description }}
          {{ item.cost }}
          {{ item.paidBy }}
        </div>
      </ng-template>
      <!-- <ng-template pTemplate="footer">Choose from the list.</ng-template> -->
    </p-dataView>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit {
  @Input() bill!: Bill;

  constructor() {}

  ngOnInit(): void {}

  addItem() {}
}
