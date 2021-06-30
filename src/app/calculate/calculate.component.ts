import { Component, Input, OnInit } from '@angular/core';
import { Bill, Ledger } from '../model/bill.model';

@Component({
  selector: 'bc-calculate',
  template: `
    <div *ngFor="let user1 of ledger | keyvalue">
      <div *ngFor="let user2 of user1.value | keyvalue">
        <ng-container *ngIf="user2.value < 0">
          {{ user1.key | titlecase }} owes
          {{ user2.key | titlecase }}
          £{{ user2.value * -1 | number: '1.2-2' }}
        </ng-container>
      </div>
    </div>
  `,
  styles: [],
})
export class CalculateComponent implements OnInit {
  ledger: Ledger | null = null;

  @Input() bill!: Bill;

  constructor() {}

  ngOnInit(): void {
    // this.ledger = this.calculate(this.bill.items);
  }

  calculate(items: any) {
    // const ledger: Ledger = this.createObjectWithEveryone(
    //   this.createObjectWithEveryone<number>(0)
    // );
    // for (const item of Object.values(items)) {
    //   for (const sharedBy of Object.values(item.sharedBy)) {
    //     ledger[item.paidBy][sharedBy.user] +=
    //       sharedBy.settled === true
    //         ? 0
    //         : item.cost / Object.keys(item.sharedBy).length;
    //     ledger[sharedBy.user][item.paidBy] -=
    //       sharedBy.settled === true
    //         ? 0
    //         : item.cost / Object.keys(item.sharedBy).length;
    //   }
    // }
    // return ledger;
  }

  private createObjectWithEveryone<T>(value: T): { [key: string]: T } {
    const object: { [key: string]: T } = {};
    this.bill.friends.forEach((friend) => {
      if (typeof value === 'object' && value !== null) {
        object[friend] = { ...value };
      } else {
        object[friend] = value;
      }
    });
    return object;
  }
}
