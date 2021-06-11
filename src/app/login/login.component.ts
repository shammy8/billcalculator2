import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'bc-login',
  template: `<button (click)="login()">Log in</button>`,
  styles: [],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['']));
  }
}
