import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Bill } from '../model/bill.model';

@Component({
  selector: 'bc-bill',
  template: ` <pre>{{ bill | json }}</pre> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent implements OnInit {
  @Input() bill: Bill | null = null;

  constructor() {}

  ngOnInit(): void {}
}
