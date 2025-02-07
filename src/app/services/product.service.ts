import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Prodotto } from '../models/Prodotto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 
  
    constructor(private http: HttpClient, private tokenService : TokenService) {}
  
    getListaProdottiByIdOrder(id: number): Observable<Prodotto[]> {
      const apiUrl = 'http://localhost:8080/api/prodotto/getListaProdottiByOrdine/'; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.token}`
      });
  
      return this.http.get<Prodotto[]>(apiUrl + id, { headers });
    }

    getListaProdotti(): Observable<Prodotto[]> {
      const apiUrl = 'http://localhost:8080/api/prodotto/getListaProdotti'; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.token}`
      });
  
      return this.http.get<Prodotto[]>(apiUrl, { headers });
    }
}
