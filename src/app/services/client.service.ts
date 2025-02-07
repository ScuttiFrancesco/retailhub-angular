import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/Order';
import { TokenService } from './token.service';
import { Cliente } from '../models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient, private tokenService : TokenService) { }

   getListaClienti(): Observable<Cliente[]> {
      const apiUrl = 'http://localhost:8080/api/cliente/getListaClienti'; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.token}`
      });
  
      return this.http.get<Cliente[]>(apiUrl, { headers });
    }

    getCliente(id:number): Observable<Cliente> {
      const apiUrl = 'http://localhost:8080/api/cliente/getCliente/'; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.token}`
      });
  
      return this.http.get<Cliente>(apiUrl + id, { headers });
    }

    inserisciCliente(order: Cliente): Observable<Cliente> {
      const apiUrl = 'http://localhost:8080/api/cliente/admin/inserisci'; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.token}`
      });
  
      return this.http.post<Cliente>(apiUrl, order, { headers });
    }
}
