import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Bill, Item, NewItemWithBill } from '../model/bill.model';

@Component({
  selector: 'bc-bill',
  templateUrl: 'bill.component.html',
  styleUrls: ['bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit {
  displayAddItemDialog = false;

  @Input() bill!: Bill;
  @Output() addItem = new EventEmitter<NewItemWithBill>();

  constructor() {}

  ngOnInit(): void {}

  openAddItemDialog() {
    this.displayAddItemDialog = true;
  }

  closeAddItemDialog() {
    this.displayAddItemDialog = false;
  }
}
