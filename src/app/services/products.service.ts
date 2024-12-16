import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private apiUrl = environment.apiUrlProducts;
  private apiUrlSell = environment.apiUrlSellProducts;

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSellProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlSell);
  }

  addSellProduct(product: Product, quantity: number): Observable<Product> {
    return this.http.post<Product>(this.apiUrlSell, {product, quantity});
  }

  searchSellProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlSell}?name=${query}`);
  }

}

