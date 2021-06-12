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
          <div class="item">
            <div class="left">
              <div class="description">
                {{ item.description }}
              </div>
              <p-multiSelect
                [options]="bill.usersArray"
                placeholder="Select shared users"
                [filter]="false"
                [maxSelectedLabels]="1"
                [selectedItemsLabel]="'{0} users selected'"
              ></p-multiSelect>
            </div>
            <div class="right">
              <div class="price">£{{ item.cost }}</div>
              <div><span class="paid-by">Paid by </span>{{ item.paidBy }}</div>
            </div>
          </div>
        </div>
      </ng-template>
      <!-- <ng-template pTemplate="footer">Choose from the list.</ng-template> -->
    </p-dataView>
  `,
  styleUrls: ['bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit {
  @Input() bill!: Bill;

  constructor() {}

  ngOnInit(): void {}

  addItem() {}
}
