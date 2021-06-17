import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'bc-login',
  template: `<button
    pButton
    icon="pi pi-google"
    label="Sign in"
    (click)="login()"
  ></button>`,
  styles: [
    `
      :host {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface-0);
      }
    `,
  ],
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
