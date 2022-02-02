import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = {
    id:'',
    sku: '',
    name:'',
    description:'',
    unitPrice:0,
    imageUrl: '',
    active: true,
    unitsInStock: 0,
    dateCreated: new Date,
    lastUpdate: new Date,
  }
  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    // pegar o id e converter para um numero
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    
    this.productService.getProduct(theProductId).subscribe((data)=>{
      this.product = data;
    })
  }

  addToCart(){
    console.log("adicionando ao carrinho: " + this.product.name +","+ this.product.unitPrice);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

}
