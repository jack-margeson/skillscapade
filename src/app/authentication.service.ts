import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { take } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private databaseService: DatabaseService
  ) {}

  login() {
    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.auth.currentUser.then((user) => {
          this.databaseService.addNewUser(user?.uid, user?.displayName);
        });
      })
      .finally(() => {
        this.router.navigate(['dashboard']);
      });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['home']);
    });
  }
}
