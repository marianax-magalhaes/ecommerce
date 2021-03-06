import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard } from '@okta/okta-angular';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';

// é importante organizar as rotas da mais especifica para mais generica!
// o '**' indica que qualquer outro caminho nao definido vai levar ao redirect, é possivel tbm fazer com que ele va para um componente customizado como" PageNotFoundComponent".

// essa constante router poderia estar dentro de app.module.ts, nem precisaria ter um arquivo so p isso!!!
const routes: Routes = [
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path:'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
  {path: 'protected',component: CheckoutComponent, canActivate: [ OktaAuthGuard ]},
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
