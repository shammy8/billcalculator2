import { Component, Input, OnInit } from '@angular/core';
import { BillWithItems, ItemWithId, Ledger } from '../model/bill.model';
import { createObjectWithEveryone } from '../utility-functions';

@Component({
  selector: 'bc-calculate',
  template: `
    <div *ngFor="let friend1 of ledger | keyvalue">
      <div *ngFor="let friend2 of friend1.value | keyvalue">
        <ng-container *ngIf="friend2.value < 0">
          {{ friend1.key | titlecase }} owes
          {{ friend2.key | titlecase }}
          £{{ friend2.value * -1 | number: '1.2-2' }}
        </ng-container>
      </div>
      <br />
    </div>
  `,
  styles: [],
})
export class CalculateComponent implements OnInit {
  ledger: Ledger | null = null;

  @Input() billWithItems!: BillWithItems;

  constructor() {}

  ngOnInit(): void {
    this.ledger = this.calculate(this.billWithItems.items);
  }

  calculate(items: ItemWithId[]) {
    const ledger: Ledger = createObjectWithEveryone(
      createObjectWithEveryone<number>(0, this.billWithItems.friends),
      this.billWithItems.friends
    );
    for (const item of items) {
      for (const sharedBy of item.sharedBy) {
        ledger[item.paidBy][sharedBy.friend] +=
          sharedBy.settled === true
            ? 0
            : item.cost / Object.keys(item.sharedBy).length;
        ledger[sharedBy.friend][item.paidBy] -=
          sharedBy.settled === true
            ? 0
            : item.cost / Object.keys(item.sharedBy).length;
      }
    }
    return ledger;
  }
}
