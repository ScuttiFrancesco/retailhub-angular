import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private service: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    this.login(username, password);
  }

  login(username: string, password: string) {
    this.service.login(username, password).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        alert('ACCESSO NEGATO');
        console.error('Errore di login:', error);
      }
    );
  }


}
