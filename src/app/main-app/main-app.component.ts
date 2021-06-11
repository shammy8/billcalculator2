import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'bc-main-app',
  template: `
    <button pButton (click)="signOut()">Sign out</button>
    <p>main-app works!</p>
  `,
  styles: [],
})
export class MainAppComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {}

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
