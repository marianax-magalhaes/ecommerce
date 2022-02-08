import { Component, OnInit } from '@angular/core';
import myAppConfig from '../../config/my-app-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import {
  OKTA_CONFIG,
  OktaAuthModule,
} from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuth) { 
    this.oktaSignin = new OktaSignIn ({
      logo: 'assets/images/hp-logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    })
  }

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      // el tem o mesmo nome do id na tag div do html
      el:'#okta-sign-in-widget'},
      (response: { status: string; })=>{
        if(response.status === 'SUCCESS'){
          this.oktaAuthService.signInWithRedirect();
        }
      }, (error: any) =>{
        throw error;
      }
    )
  }

}
