import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  // ?size=100 indica que queremos que mostre os 100 primeiros itens pq por default mostra apenas 20 primeiros.
  // private baseUrl = 'http://localhost:8080/api/products?size=100'

  private baseUrl = 'http://localhost:8080/api/products'

  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private http: HttpClient) { }

  getProductList(theCategoryId: number):Observable<Product[]>{
    const url = this.baseUrl + "/search/findByCategoryId?id=" + theCategoryId;

    return this.http.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}