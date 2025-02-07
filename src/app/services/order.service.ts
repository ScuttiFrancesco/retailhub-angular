import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../models/Order';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private refreshData = new BehaviorSubject<void>(undefined);

  // Observable per notificare gli aggiornamenti
  refreshData$ = this.refreshData.asObservable();

  // Metodo per notificare che i dati devono essere aggiornati
  notifyDataChange() {
    this.refreshData.next();
  }

  getOrdersByStato(stato: string): Observable<Order[]> {
    const apiUrl =
      'http://localhost:8080/api/ordine/getListaOrdiniByStatoOrdine/';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.token}`,
    });

    return this.http.get<Order[]>(apiUrl + stato, { headers });
  }

  getOrderById(id: number): Observable<Order> {
    const apiUrl = 'http://localhost:8080/api/ordine/getOrdine/';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.token}`,
    });

    return this.http.get<Order>(apiUrl + id, { headers });
  }

  inserisciOrdine(order: Order): Observable<Order> {
    const apiUrl = 'http://localhost:8080/api/ordine/admin/inserisci';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.token}`,
    });

    return this.http.post<Order>(apiUrl, order, { headers });
  }

  aggiornaOrdine(order: Order): Observable<Order> {
    const apiUrl = 'http://localhost:8080/api/ordine/admin/aggiorna/';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.token}`,
    });

    return this.http.put<Order>(apiUrl + order.id?.toString(), order, {
      headers,
    });
  }

  eliminaOrdine(id: number): Observable<Order> {
    const apiUrl = 'http://localhost:8080/api/ordine/admin/elimina/';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.tokenService.token}`,
    });

    return this.http.delete<Order>(apiUrl + id.toString(), {
      headers,
    });
  }
}
