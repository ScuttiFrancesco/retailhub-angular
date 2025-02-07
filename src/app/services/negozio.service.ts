import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Negozio } from '../models/Negozio';

@Injectable({
  providedIn: 'root'
})
export class NegozioService {

  constructor(private http: HttpClient, private tokenService : TokenService) {}
   
     getListaNegozi(): Observable<Negozio[]> {
       const apiUrl = 'http://localhost:8080/api/negozio/getListaNegozi'; 
       const headers = new HttpHeaders({
         'Authorization': `Bearer ${this.tokenService.token}`
       });
   
       return this.http.get<Negozio[]>(apiUrl, { headers });
     }

     getNegozio(id:number): Observable<Negozio> {
           const apiUrl = 'http://localhost:8080/api/negozio/getNegozio/'; 
           const headers = new HttpHeaders({
             'Authorization': `Bearer ${this.tokenService.token}`
           });
       
           return this.http.get<Negozio>(apiUrl + id, { headers });
         }
}
