import { Component, Input, OnInit } from '@angular/core';
import { BillWithItems, ItemWithId } from '../model/bill.model';

@Component({
  selector: 'bc-total-spendings',
  template: `<div *ngFor="let friend of totalSpendings | keyvalue">
    {{ friend.key | titlecase }} spent £{{ friend.value | number: '1.2-2' }}
  </div>`,
  styles: [],
})
export class TotalSpendingsComponent implements OnInit {
  totalSpendings: { [key: string]: number } = {};

  @Input() billWithItems!: BillWithItems;

  constructor() {}

  ngOnInit(): void {
    this.totalSpendings = this.calculateTotalSpendings(
      this.billWithItems.items
    );
  }

  calculateTotalSpendings(items: ItemWithId[]) {
    const totalSpendingsObject = this.createObjectWithEveryone<number>(0);
    for (const item of items) {
      for (const sharedBy of item.sharedBy) {
        totalSpendingsObject[sharedBy.friend] +=
          item.cost / Object.keys(item.sharedBy).length;
      }
    }
    return totalSpendingsObject;
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
