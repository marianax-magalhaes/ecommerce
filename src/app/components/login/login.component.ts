import { Component, OnInit } from '@angular/core';

import { OktaAuthStateService } from '@okta/okta-angular';
import { Tokens } from '@okta/okta-auth-js';
//@ts-ignore
import * as OktaSignIn from '@okta/okta-signin-widget';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authService;
  widget = new OktaSignIn({
    el: '#okta-signin-container',
    issuer:'https://dev-66716514.okta.com/oauth2/default',
    authParams: {
      pkce: true
    },
         clientId: '0oa3towog0qQnX4FH5d7',
         redirectUri: 'http://localhost:4200/login/callback'
  });

  oktaSignin: any;

  constructor() { 
  }

  ngOnInit(): void {
    
  }

}
