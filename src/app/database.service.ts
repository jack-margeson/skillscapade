import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
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
        console.log(queryResults);
        if (queryResults.length == 0) {
          this.usersCollection.add({
            uid: uid,
            prefered_name: prefered_name,
            points: 0,
          });
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
