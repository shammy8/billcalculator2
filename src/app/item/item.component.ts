import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Item } from '../model/bill.model';

@Component({
  selector: 'bc-item',
  templateUrl: 'item.component.html',
  styleUrls: ['item.component.scss'],
})
export class ItemComponent implements OnInit, OnChanges {
  form!: FormGroup;
  formChangesSub!: Subscription;

  get sharedByForm() {
    return this.form.get('sharedBy') as FormArray;
  }

  @Input() item!: Item;

  @Output() itemChange = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<Item>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.initialiseForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.item) {
      this.initialiseForm();
    }
  }

  private initialiseForm() {
    this.form = this.fb.group({
      id: this.item.id,
      description: this.item.description,
      cost: this.item.cost,
      paidBy: this.item.paidBy,
      sharedBy: this.fb.array([]),
    });

    for (let sharedByElement of this.item.sharedBy) {
      this.sharedByForm.push(
        this.fb.group({
          settled: sharedByElement.settled,
          friend: sharedByElement.friend,
        })
      );
    }

    // every time Firestore pushes a new item to us we create a new form via ngOnChanges
    // hence need to unsubscribe from previous subscription and subscribe again to form.valueChanges
    // this is actually good cause it means we don't go into an infinite loop when changing the form
    this.formChangesSub?.unsubscribe();
    this.formChangesSub = this.form.valueChanges.subscribe((changes) =>
      this.itemChange.emit(changes)
    );
  }

  ngOnDestroy() {
    this.formChangesSub?.unsubscribe();
  }
}
