import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
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

  @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  isDashboard: boolean = false;
  isProfile: boolean = true;

  tracts: Array<any> = [];

  constructor(
    private authenticationService: AuthenticationService,
    private databaseService: DatabaseService,
    private router: Router
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
    this.databaseService.getTractsObservable().subscribe((tracts: any) => {
      this.tracts = [];
      tracts.forEach((tract: any) => {
        this.tracts.push(tract);
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

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  switch(option: string): void {
    if (option == 'dashboard') {
      this.isDashboard = true;
      this.isProfile = false;
    } else {
      this.isDashboard = false;
      this.isProfile = true;
    }
  }

  openTract(tract: any) {
    this.router.navigateByUrl('tract?id=' + tract.id.trim());
  }
}
