import { Component, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js'

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;

  userFullName: string = '';

  constructor(private oktaAuthService: OktaAuth, public authStateService: OktaAuthStateService) { }

  ngOnInit(): void {
    this.authStateService.authState$.subscribe((result:any)=>{
      this.isAuthenticated = result.user.isAuthenticated;this.getUserDetails();
    })
  }

  getUserDetails(){
    if(this.isAuthenticated){
      this.authStateService
    }
  }

}
