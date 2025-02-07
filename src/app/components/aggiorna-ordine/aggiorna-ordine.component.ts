import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Cliente } from '../../models/Cliente';
import { Negozio } from '../../models/Negozio';
import { Operatore } from '../../models/Operatore';
import { Order } from '../../models/Order';
import { Prodotto } from '../../models/Prodotto';
import { ClientService } from '../../services/client.service';
import { NegozioService } from '../../services/negozio.service';
import { OperatorService } from '../../services/operator.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-aggiorna-ordine',
  standalone: false,

  templateUrl: './aggiorna-ordine.component.html',
  styleUrl: './aggiorna-ordine.component.css',
})
export class AggiornaOrdineComponent implements OnInit {

  onDateBlur() {
    if (this.date) {
      // Formatta la data in dd-MM-yyyy
      const formattedDate = formatDate(this.date, 'dd-MM-yyyy', 'en-US');
      this.date = formattedDate;
    }
  }

  constructor(
    private productService: ProductService,
    private clientService: ClientService,
    private operatorService: OperatorService,
    private negozioService: NegozioService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private homecomponent: HomeComponent
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
  selecteInput: boolean = false;

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

  private id: number = 0;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = +params['id'];
      this.loadProducts();
      this.loadClients();
      this.loadOperators();
      this.loadNegozi();
      this.caricamentoOrdineDaModificare();
    });
  }

  //prodotto da modificare
  ordineDaModificare: Order = new Order();

  caricamentoOrdineDaModificare() {
    const orderPromise = this.orderService.getOrderById(this.id).toPromise();
    const productPromise = this.productService
      .getListaProdottiByIdOrder(this.id)
      .toPromise();

    Promise.all([orderPromise, productPromise])
      .then(([order, product]) => {
        this.ordineDaModificare = order!;
        this.ordineDaModificare.id = this.id;
        this.date = this.ordineDaModificare.dataOrdine!;
        this.client = this.ordineDaModificare.cliente!;
        this.selectedClientId = this.client.id?.toString()!;
        this.operator = this.ordineDaModificare.operatore!;
        this.selectedOperatorId = this.operator.id?.toString()!;
        this.negozio = this.ordineDaModificare.negozio!;
        this.selectedNegozioId = this.negozio.id?.toString()!;
        this.ordineDaModificare.prodotti = product!;
        for(let p of this.ordineDaModificare.prodotti){
          p.quantita = 1;
        }
        console.log(product)
        this.products = this.ordineDaModificare.prodotti!;
      })
      .catch((error) => {
        console.error("Errore nel recupero dei dettagli dell'ordine:", error);
        alert(error.messaggio);
      });
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
  aggiornaOrdine(ordine: Order): void {
    this.orderService.aggiornaOrdine(ordine).subscribe(
      (data) => {
        alert('Ordine modificato con successo');
        this.orderService.notifyDataChange();
        this.router.navigate(['home']);
        this.homecomponent.showtable = true;
       
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  getDataDiOggiFormattata(): string {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    return formatDate(oggi, 'yyyy-MM-dd', 'en-US');
  }

  formatData(date: string): string {
    console.log(date)
    const parsedDate = moment(date, 'DD-MM-YYYY', true);
    if (!parsedDate.isValid()) {
      throw new Error('Invalid Date');
    }
    return parsedDate.format('YYYY-MM-DD');
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
        alert('Cliente inserito con successo');
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
        this.order.id = this.id;
        this.order.cliente = this.client;
        this.order.operatore = this.operator;
        this.order.negozio = this.negozio;
        this.order.pagamentoOrdine = 'DAPAGARE';
        this.order.statoOrdine = 'RICEVUTO';
        this.order.dataOrdine = this.formatData(
        this.date);
        this.order.prodotti = this.products;
        console.log('Ordine:', this.order);
        this.aggiornaOrdine(this.order);
      })
      .catch((error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
      );
  }

  //aggiunge i prodotti alla lista che viene poi mostrata
  addProduct() {
    if (!this.newProduct.id || this.newQuantity < 1) {
      alert(
        'Inserisci un nome di prodotto valido e una quantità maggiore di zero.'
      );
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
    return this.products?.length > 0 && !!this.selectedClientId;
  }
}
