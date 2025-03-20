import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { Order } from '../models/Order';
import { TokenService } from './token.service';
import { AppComponent } from '../app.component';
import { Cliente } from '../models/Cliente';
import { Operatore } from '../models/Operatore';
import { Negozio } from '../models/Negozio';
import { Prodotto } from '../models/Prodotto';
import { ClientService } from './client.service';
import { OperatorService } from './operator.service';
import { ProductService } from './product.service';
import { NegozioService } from './negozio.service';
import { MqttInsert } from '../models/MqttInsert';
import { formatDate } from '@angular/common';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    
    private clienteService: ClientService,
    private operatoreService: OperatorService,
    private prodottoService: ProductService,
    private negozioService: NegozioService,
    private notificationService: NotificationService
  ) {}

  showAvviso = false;
  messaggioModale = '';
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

  ordine = new Order();

  loadProducts(prodotti: any): Observable<Prodotto[]> {
    const productObservables = prodotti.map((prodotto: any) =>
      this.prodottoService.getProdotto(prodotto.idProdotto)
    );

    return forkJoin<Prodotto[]>(productObservables).pipe(
      tap((loadedProducts: Prodotto[]) => {
        this.ordine.prodotti = loadedProducts;
      }),
      catchError((error: Error) => {
        console.error('Errore nel caricamento dei dati:', error);
        return [];
      })
    );
  }

  loadData(
    idCliente: number,
    idOperatore: number,
    idNegozio: number,   
    prodotti:any 
  ): void {
    forkJoin({
      cliente: this.clienteService.getCliente(idCliente),
      operatore: this.operatoreService.getOperatore(idOperatore),
      negozio: this.negozioService.getNegozio(idNegozio),
      prodotti: this.loadProducts(prodotti),
      
    }).subscribe({
      next: ({ cliente, operatore, negozio, prodotti }) => {
        this.ordine.cliente = cliente;
        this.ordine.operatore = operatore;
        this.ordine.negozio = negozio; 
        this.ordine.prodotti = prodotti;   
        
      },
      error: (error: Error) => {
        console.error('Errore nel caricamento dei dati:', error);
      },
    });
  }

  formatDate(date: Date): string {
      date.setHours(0, 0, 0, 0);
      return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }

  insertOrderMqtt(order: MqttInsert) {
    const today = new Date();
    const formattedDate = this.formatDate(today);
    this.ordine.dataOrdine = formattedDate;
    console.log(this.ordine.dataOrdine);
    this.ordine.statoOrdine = 'RICEVUTO';
    this.ordine.pagamentoOrdine = 'DAPAGARE';
    this.loadData(order.idCliente, order.idOperatore, order.idNegozio, order.prodotti);
    this.inserisciOrdine(this.ordine).subscribe({
      next: (data) => {        
        this.notifyDataChange();
        this.notificationService.changeMessage('Ordine inserito con successo');
        this.notificationService.changeVisibility(true);
      },
      error: (error: Error) => {
        this.notificationService.changeMessage(error.message);
        this.notificationService.changeVisibility(true);
        console.error('Errore nel caricamento dei dati:', error);
      },
    });
  }
}
