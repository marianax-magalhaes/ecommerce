import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[]=[];

  currentCategoryId: number = 0;
  currentCategoryName: string = '';

  constructor(private service: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

  listProducts() {
    // checar se id existe
    const hasCategoryID: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryID){
      // converter id de string para nome:
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else{
      // se nao existe o id, vamos para categoria 1:
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // pegar produtos da categoria 'id'
    this.service.getProductList(this.currentCategoryId).subscribe(data => {
      this.products = data;
    });
  }

}
