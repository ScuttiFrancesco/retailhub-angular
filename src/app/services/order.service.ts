import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/Order';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService  {
   
  

  constructor(private http: HttpClient, private tokenService : TokenService) {}

  

  getOrdersByStato(p0: string): Observable<Order[]> {
    const apiUrl = 'http://localhost:8080/api/ordine/getListaOrdiniByStatoOrdine/'; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.token}`
    });

    return this.http.get<Order[]>(apiUrl + 'RICEVUTO', { headers });
  }

  getOrderById(id: number): Observable<Order> {
    const apiUrl = 'http://localhost:8080/api/ordine/getOrdine/'; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.token}`
    });

    return this.http.get<Order>(apiUrl + id, { headers });
  }
}
