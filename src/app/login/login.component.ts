import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'bc-login',
  template: `<div>
    <button
      pButton
      icon="pi pi-google"
      label="Sign in with Google"
      (click)="loginWithGoogle()"
    ></button>
    <button
      pButton
      label="Sign in anonymously"
      (click)="loginAnonymously()"
    ></button>
  </div>`,
  styles: [
    `
      :host {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface-0);
      }
      button {
        display: block;
        width: 200px;
        margin-bottom: 50px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {}

  loginWithGoogle() {
    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['']));
  }

  loginAnonymously() {
    this.auth.signInAnonymously().then(() => this.router.navigate(['']));
  }
}
