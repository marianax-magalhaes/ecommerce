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

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';

  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number =0;

  constructor(private service: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    } else{
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.service.searchProducts(theKeyword).subscribe(
      (data)=>{
        this.products=data;
      })
  }

  handleListProducts(){
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

    // checar se a categoria é diferente da anterior, se sim, voltar o pagenumber para 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log("current category id: " + this.currentCategoryId + ", the page number: " + this.thePageNumber)




    // pegar produtos da categoria 'id'
    // em angular a paginacao é baseada em 1 e no java 0, por iss temos que fazer "-1"
    this.service.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
  

  }

  processResult(){
    return (data:any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  } 

}
