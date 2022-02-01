import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
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
  constructor(private service: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    // pegar o id e converter para um numero
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    
    this.service.getProduct(theProductId).subscribe((data)=>{
      this.product = data;
    })
  }

}
