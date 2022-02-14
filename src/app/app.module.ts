import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import{HttpClientModule} from '@angular/common/http'
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import{NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component'

import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import {
  OKTA_CONFIG,
  OktaAuthModule,
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';


const config = {
  clientId: '0oa3towog0qQnX4FH5d7',
  issuer:'https://dev-66716514.okta.com/oauth2/default',
  redirectUri:'http://localhost:4200/login/callback',
  scopes: ['openid', 'profile', 'email']
}
const oktaAuth = new OktaAuth(config);


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
    
    
  ],
  providers: [ProductService,
  { 
    provide: OKTA_CONFIG, 
    useValue: { oktaAuth } 
  }],

  bootstrap: [ AppComponent ]
})
export class AppModule { }
