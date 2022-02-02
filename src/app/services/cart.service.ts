import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // subject ´´uma sublcasse de observable. quando ele for emitido, enviara para todos os observables
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){
    // verificar se o item ja esta no carrinhor
    let alreadyExistsInCart: boolean = false;
    // so com undefined dava erro, achei na internet essa solucao, e tive que adicionar um ! na hora do incremento la embaixo
    let existingCartItem: CartItem | undefined = undefined;

    if(this.cartItems.length >0){
      // achar o item no carrinho baseado no seu indica
      for (let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }

      // verificar se encontramos
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      // incrementar quantidade
      existingCartItem!.quantity++;
    } else{
      // adicionar item ao array de
      this.cartItems.push(theCartItem)
    }

    // calcylar total de produtos e do preco
    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publicacao dos novos valores para todos os subsrcibers
    // o next é responsavel por isso
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    console.log("conteudo do carrinho");
    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
      console.log("nome: " + tempCartItem.name + ", quantidade: " + tempCartItem.quantity + ", preço unitário: " + tempCartItem.unitPrice + ", subtotal: " + subTotalPrice);
    }
    console.log("Total: " + totalPriceValue.toFixed(2) + ", quantidade total: " + totalQuantityValue);
  }
}
