import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'bc-root',
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  title = 'billcalculator2';

  constructor(private af: AngularFirestore) {}

  ngOnInit() {
    this.af.collection('bill').valueChanges().subscribe(console.log);
  }
}
