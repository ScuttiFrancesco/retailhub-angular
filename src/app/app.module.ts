import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DettagliOrdineComponent } from './components/dettagli-ordine/dettagli-ordine.component';
import { InserimentoOrdineComponent } from './components/inserimento-ordine/inserimento-ordine.component';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { ModalComponent } from './components/modal/modal.component';
import { AggiornaOrdineComponent } from './components/aggiorna-ordine/aggiorna-ordine.component';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions={
  keepalive:120,
  port:443,
  path:'/ws',
  protocol:'wss',
  username: 'intellitronika',
  password: 'intellitronika',
  hostname:'rabbitmq.test.intellitronika.com'
} as IMqttServiceOptions;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DettagliOrdineComponent,
    InserimentoOrdineComponent,
    ModalComponent,
    AggiornaOrdineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [ provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})

export class AppModule { }


