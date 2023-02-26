import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  constructor(private authenticationService: AuthenticationService) {}
  login(): void {
    this.authenticationService.login();
  }
  logout(): void {
    this.authenticationService.logout();
  }
}
