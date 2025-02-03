import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class TokenService{

   token :string =''; 
    
      constructor(private http: HttpClient) {}
    
      getToken(user: User): Observable<string> {
        const apiUrl = 'http://localhost:8080/auth/login';
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
    
        return this.http.post(apiUrl, user, { 
          headers, 
          responseType: 'text' // Change response type to text
        });
      }
}
