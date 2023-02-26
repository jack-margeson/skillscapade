import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import firebase from 'firebase/compat/app';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  displayName: string | null | undefined;
  userPoints: number | null | undefined;

  constructor(
    private authenticationService: AuthenticationService,
    private databaseService: DatabaseService
  ) {
    this.authenticationService.auth.user.subscribe((user) => {
      this.databaseService
        .getUserDataObservable(user?.uid)
        .subscribe((data: any) => {
          this.displayName = data.prefered_name;
          this.userPoints = data.points;
        });
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
  }
}
