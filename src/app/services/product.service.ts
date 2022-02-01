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
  
  getProduct(theProductId: number): Observable<Product>{
    const url = this.baseUrl + "/" + theProductId;
    return this.http.get<Product>(url);
  }

  getProductList(theCategoryId: number):Observable<Product[]>{
    const url = this.baseUrl + "/search/findByCategoryId?id=" + theCategoryId;

    return this.getProducts(url);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const url = this.baseUrl + "/search/findByNameContaining?name=" + theKeyword;

    return this.getProducts(url);
  }

  // como estava se repetindo, transofrmamos ele num metodo para o cdg ficar enxuto
  private getProducts(url: string): Observable<Product[]> {
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