import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-tract',
  templateUrl: './tract.component.html',
  styleUrls: ['./tract.component.sass'],
})
export class TractComponent {
  tract: any = {};

  constructor(
    private authenticationService: AuthenticationService,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    let params: URLSearchParams = new URLSearchParams(window.location.search);
    this.databaseService
      .getTractObservable(params.get('id'))
      .pipe(take(1))
      .subscribe((queryResponse: any) => {
        this.tract = queryResponse;
        console.log(queryResponse);
      });
  }

  submit(): void {
    this.authenticationService.auth.currentUser.then((user) => {
      this.databaseService.modifyPoints(user?.uid, 100);
      this.router.navigateByUrl('dashboard');
    });
  }
}
