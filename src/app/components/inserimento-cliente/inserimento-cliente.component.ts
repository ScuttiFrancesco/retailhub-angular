import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-inserimento-cliente',
  standalone: false,
  
  templateUrl: './inserimento-cliente.component.html',
  styleUrl: './inserimento-cliente.component.css'
})
export class InserimentoClienteComponent {

  constructor(private router : Router){}
onSubmitClient(_t5: NgForm) {
throw new Error('Method not implemented.');
}
indietro() {
  this.router.navigate(['home']);
}

}
