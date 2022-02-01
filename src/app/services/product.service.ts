import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ?size=100 indica que queremos que mostre os 100 primeiros itens pq por default mostra apenas 20.
  // private baseUrl = 'http://localhost:8080/api/products?size=100'

  private baseUrl = 'http://localhost:8080/api/products?'

  constructor(private http: HttpClient) { }

  getProductList():Observable<Product[]>{
    return this.http.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    );
  }

}

interface GetResponse{
  _embedded:{
    products: Product[];
  }
}