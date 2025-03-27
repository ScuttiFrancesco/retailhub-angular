import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Prodotto } from '../../models/Prodotto';
import { ClientService } from '../../services/client.service';
import { Cliente } from '../../models/Cliente';
import { Order } from '../../models/Order';
import { OperatorService } from '../../services/operator.service';
import { Operatore } from '../../models/Operatore';
import { NegozioService } from '../../services/negozio.service';
import { Negozio } from '../../models/Negozio';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { NgForm } from '@angular/forms';
import moment from 'moment';
import { MqttsService } from '../../services/mqtt.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-inserimento-ordine',
  standalone: false,

  templateUrl: './inserimento-ordine.component.html',
  styleUrl: './inserimento-ordine.component.css',
})
export class InserimentoOrdineComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private clientService: ClientService,
    private operatorService: OperatorService,
    private negozioService: NegozioService,
    private orderService: OrderService,
    private router: Router,
    private homecomponent: HomeComponent,
    private mqttService: MqttsService,
    private appComponent: AppComponent
  ) {}

  // oggetti per il trasferimento dei dati
  client: Cliente = new Cliente();
  operator: Operatore = new Operatore();
  negozio: Negozio = new Negozio();
  order: Order = new Order();

  // array per la lista di oggetti
  productsList: Prodotto[] = [];
  clientsList: Cliente[] = [];
  operatorsList: Operatore[] = [];
  negoziList: Negozio[] = [];

  // array e nuovo prodotto per il carrello
  products: Prodotto[] = [];

  newProduct: Prodotto = new Prodotto();
  newQuantity: number = 0;

  selectedOperator: Operatore = new Operatore();

  // id per il recupero degli oggetti
  selectedNegozioId: string = '';
  selectedOperatorId: string = '';
  selectedClientId: string = '';

  date: string = '';

  dataRegistrazione: string = this.getDataDiOggiFormattata();

  ngOnInit(): void {
    this.loadProducts();
    this.loadClients();
    this.loadOperators();
    this.loadNegozi();
  }

  //caricamento lista negozi
  loadNegozi() {
    this.negozioService.getListaNegozi().subscribe(
      (data) => {
        this.negoziList = data;
      },
      (error) => {
        console.error("Errore nel recupero dei dettagli dell'ordine:", error);
        alert(error.error.messaggio);
      }
    );
  }

  //caricamento lista operatori
  loadOperators(): void {
    this.operatorService.getListaOperatori().subscribe(
      (data) => {
        this.operatorsList = data;
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  //caricamento lista prodotti
  loadProducts(): void {
    this.productService.getListaProdotti().subscribe(
      (data) => {
        this.productsList = data;
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  //caricamento lista clienti
  loadClients(): void {
    this.clientService.getListaClienti().subscribe(
      (data) => {
        this.clientsList = data;
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }
  //inserimento ordine
  inserisciOrdine(ordine: Order): void {
    this.orderService.inserisciOrdine(ordine).subscribe(
      (data) => {
        this.appComponent.showAvviso = true;
        this.appComponent.messaggioModale = 'Ordine inserito con successo';
        this.homecomponent.showtable = true;
        this.orderService.notifyDataChange();
        this.router.navigate(['home']);
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  getDataDiOggiFormattata(): string {
    return new Date().toISOString();
  }

  formatDate(date: Date): string {
    return date.toISOString();
  }

  onSubmitNewClient(form: NgForm) {
    const cliente: Cliente = new Cliente();
    cliente.nome = form.value.nome;
    cliente.cognome = form.value.cognome;
    cliente.ddn = moment(form.value.ddn).format('DD-MM-yyyy').toString();
    cliente.email = form.value.email;
    cliente.telefono = form.value.telefono;
    cliente.dataRegistrazione = this.dataRegistrazione;

    this.clientService.inserisciCliente(cliente).subscribe(
      (data) => {
        this.selectedClientId = data.id!.toString();
        this.clientsList.push(data);
        this.appComponent.showAvviso = true;
        this.appComponent.messaggioModale = 'Ordine inserito con successo';
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  onSubmit() {
    const clientPromise = this.clientService
      .getCliente(parseInt(this.selectedClientId))
      .toPromise();
    const operatorPromise = this.operatorService
      .getOperatore(parseInt(this.selectedOperatorId))
      .toPromise();
    const negozioPromise = this.negozioService
      .getNegozio(parseInt(this.selectedNegozioId))
      .toPromise();

    Promise.all([clientPromise, operatorPromise, negozioPromise])
      .then(([client, operator, negozio]) => {
        this.client = client!;
        this.operator = operator!;
        this.negozio = negozio!;
        this.order.cliente = this.client;
        this.order.operatore = this.operator;
        this.order.negozio = this.negozio;
        this.order.pagamentoOrdine = 'DAPAGARE';
        this.order.statoOrdine = 'RICEVUTO';
        
        // Modificare questa riga per usare il formato ISO completo con timezone
        const dateObj = new Date(this.date);
        this.order.dataOrdine = dateObj.toISOString(); // Formato 2025-03-27T00:00:00.000Z
        
        this.order.prodotti = this.products;
        console.log('Ordine:', this.order);
        this.inserisciOrdine(this.order);
      })
      .catch((error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
      );
  }

  //aggiunge i prodotti alla lista che viene poi mostrata
  addProduct() {
    if (!this.newProduct.id || this.newQuantity < 1) {
      this.appComponent.showAvviso = true;
        this.appComponent.messaggioModale = 'Inserire un prodotto e una quantità';
      return;
    }

    const prodTemp = { ...this.newProduct };
    prodTemp.quantita! =
      this.newQuantity +
      (this.products.find((p) => p.id === this.newProduct.id)?.quantita || 0);

    const existingProduct: Prodotto | undefined = this.productsList.filter(
      (p) => p.id === this.newProduct.id
    )[0];
    console.log(this.newQuantity + ' ' + existingProduct?.quantita);
    if (prodTemp.quantita > existingProduct!.quantita!) {
      alert('Quantita superiore a quella disponibile in magazzino.');
      prodTemp.quantita -= this.newQuantity;
      return;
    }

    if (this.products.find((p) => p.id === this.newProduct.id)) {
      const index = this.products.findIndex((p) => p.id === prodTemp.id);
      this.products.splice(index, 1);
    }

    this.products.push(prodTemp);

    this.newProduct = new Prodotto();

    this.newQuantity = 0;
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

  isFormValid(): boolean {
    return this.products.length > 0 && !!this.selectedClientId;
  }
}
