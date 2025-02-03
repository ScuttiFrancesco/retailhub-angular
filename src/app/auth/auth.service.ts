import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticate = false;

  constructor(private tokenService: TokenService, private router : Router) {}

  login(username: string, password: string): Observable<string> {
    console.log('Attempting login...');
    const user = new User();
    user.username = username;
    user.password = password;
    return this.tokenService.getToken(user).pipe(
      tap({
        next: (token) => {
          console.log('Token received:', token);
          this.tokenService.token = token;
          this.authenticate = true;
        },
        error: (error) => {
          console.error('Error in tap:', error);
        }
      })
    );
}

  logout(): void {
    this.authenticate = false;
    this.tokenService.token = '';
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authenticate;
  }

  setAuthenticate(b: boolean): void {
    this.authenticate = b;
  }
}
