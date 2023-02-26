import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  displayName: string | null | undefined;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.auth.user.subscribe((response) => {
      console.log(response);
      this.displayName = response?.displayName;
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
  }
}
