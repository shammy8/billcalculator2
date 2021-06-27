import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { /* Bill ,*/ Item, Ledger } from '../model/bill.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculateComponent implements OnInit {
  ledger: Ledger | null = null;
  @Input() bill!: any; // TODO

  ngOnInit(): void {
    this.ledger = this.calculate(this.bill.items);
  }

  calculate(items: Item[]) {
    const ledger: Ledger = this.createObjectWithEveryone(
      this.createObjectWithEveryone<number>(0)
    );

    for (const item of items) {
      for (const sharedBy of item.sharedBy) {
        ledger[item.paidBy][sharedBy.friend] +=
          sharedBy.settled === true ? 0 : item.cost / item.sharedBy.length;
        ledger[sharedBy.friend][item.paidBy] -=
          sharedBy.settled === true ? 0 : item.cost / item.sharedBy.length;
      }
    }
    return ledger;
  }

  private createObjectWithEveryone<T>(value: T): { [key: string]: T } {
    const object: { [key: string]: T } = {};
    this.bill.friends.forEach((person: any) => {
      if (typeof value === 'object' && value !== null) {
        object[person] = { ...value };
      } else {
        object[person] = value;
      }
    });
    return object;
  }
}
