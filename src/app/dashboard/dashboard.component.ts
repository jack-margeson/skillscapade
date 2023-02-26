import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  userUID: string | undefined;
  userDisplayName: string | null | undefined;
  userPoints: number | null | undefined;

  constructor(
    private authenticationService: AuthenticationService,
    private databaseService: DatabaseService
  ) {
    this.authenticationService.auth.user.subscribe((user) => {
      this.userUID = user?.uid;
      this.databaseService
        .getUserDataObservable(user?.uid)
        .subscribe((data: any) => {
          this.userDisplayName = data.prefered_name;
          this.userPoints = data.points;
        });
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
  }

  modifyPoints(points: number): void {
    this.databaseService.modifyPoints(this.userUID, points);
  }
}
