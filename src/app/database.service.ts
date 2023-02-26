import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  usersCollection: AngularFirestoreCollection<any>;

  constructor(private angularFirestore: AngularFirestore) {
    this.usersCollection = angularFirestore.collection('users');
  }

  addNewUser(
    uid: string | undefined,
    prefered_name: string | null | undefined
  ): void {
    this.angularFirestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(take(1))
      .subscribe((queryResults) => {
        if (queryResults.length == 0) {
          this.usersCollection.doc(uid).set({
            uid: uid,
            prefered_name: prefered_name,
            points: 0,
          });
        }
      });
  }

  modifyPoints(uid: string | undefined, points: number) {
    this.angularFirestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(take(1))
      .subscribe((queryResults: any) => {
        if (queryResults.length != 0) {
          this.usersCollection
            .doc(uid)
            .update({ points: parseInt(queryResults[0].points) + points });
        }
      });
  }

  modifyPreferedName(uid: string | undefined, displayName: string) {
    this.angularFirestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(take(1))
      .subscribe((queryResults: any) => {
        if (queryResults.length != 0) {
          this.usersCollection.doc(uid).update({ preferred_name: displayName });
        }
      });
  }

  getUserDataObservable(uid: string | undefined): Observable<Object> {
    return this.angularFirestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .valueChanges()
      .pipe(map((queryResponse: any) => queryResponse[0]));
  }
}
