import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';
import { DettagliOrdineComponent } from './components/dettagli-ordine/dettagli-ordine.component';
import { InserimentoOrdineComponent } from './components/inserimento-ordine/inserimento-ordine.component';
import { AggiornaOrdineComponent } from './components/aggiorna-ordine/aggiorna-ordine.component';
import { InserimentoClienteComponent } from './components/inserimento-cliente/inserimento-cliente.component';
import { GraficiComponent } from './components/grafici/grafici.component';

const routes: Routes = [
  {path: 'home', canActivate: [authGuard],component: HomeComponent, children: [
    {path: 'dettagli-ordine/:id', component: DettagliOrdineComponent},
    {path: 'inserimento-ordine', component: InserimentoOrdineComponent},
    {path: 'aggiorna-ordine/:id', component: AggiornaOrdineComponent},
    {path: 'grafici', component: GraficiComponent},
    
  ]},
  {path: 'inserimento-cliente', canActivate: [authGuard], component: InserimentoClienteComponent},
  {path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
