import { Component, Input, OnInit } from '@angular/core';
import { BillWithItems, ItemWithId, Ledger } from '../model/bill.model';

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
    const ledger: Ledger = this.createObjectWithEveryone(
      this.createObjectWithEveryone<number>(0)
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

  private createObjectWithEveryone<T>(value: T): { [key: string]: T } {
    const object: { [key: string]: T } = {};
    this.billWithItems.friends.forEach((friend) => {
      if (typeof value === 'object' && value !== null) {
        object[friend] = { ...value };
      } else {
        object[friend] = value;
      }
    });
    return object;
  }
}
