import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente';
import { TokenService } from './token.service';
import { Operatore } from '../models/Operatore';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

 constructor(private http: HttpClient, private tokenService : TokenService) { }
 
    getListaOperatori(): Observable<Operatore[]> {
       const apiUrl = 'http://localhost:8080/api/operatore/getListaOperatori'; 
       const headers = new HttpHeaders({
         'Authorization': `Bearer ${this.tokenService.token}`
       });
   
       return this.http.get<Operatore[]>(apiUrl, { headers });
     }

     getOperatore(id:number): Observable<Operatore> {
      const apiUrl = 'http://localhost:8080/api/operatore/getOperatore/'; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.token}`
      });
  
      return this.http.get<Operatore>(apiUrl + id, { headers });
    }
}
