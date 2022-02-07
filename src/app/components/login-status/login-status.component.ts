import { Component, OnInit } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js'

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;

  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuth) { }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe((result:any)=>{
      this.isAuthenticated = result.user.isAuthenticated;this.getUserDetails();
    })
  }

  getUserDetails(){

  }

}
