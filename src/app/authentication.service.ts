import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public auth: AngularFireAuth, private router: Router) {}

  login() {
    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['home']);
    });
  }
}
