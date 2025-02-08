import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/Order';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Prodotto } from '../../models/Prodotto';
import { ProductService } from '../../services/product.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-dettagli-ordine',
  standalone: false,

  templateUrl: './dettagli-ordine.component.html',
  styleUrl: './dettagli-ordine.component.css',
})
export class DettagliOrdineComponent implements OnInit {
  mostraModale: boolean = false;
  messaggioInput = '';
  next() {
    console.log(this.orders);
    let index = this.orders.findIndex((o) => o.id === Number(this.id));
    console.log(index);
    console.log(this.id);
    if (index === -1 || index + 1 >= this.orders.length) {
      this.mostraModale = true;
      this.messaggioInput = 'Ordine non trovato o nessun ordine successivo';
      return;
    }

    const newId = this.orders[index + 1].id;
    this.route1.navigate(['../', newId], { relativeTo: this.route });
    this.loadOrderDetails(newId!);
    this.id = newId!;
  }
  indietro() {
    this.route1.navigate(['home']);
    this.homeComp.showtable = true;
  }
  products: Prodotto[] = [];
  id: number = 0;
  ordine: Order | undefined;
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private route1: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private homeComp: HomeComponent
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadOrderDetails(this.id);
    this.loadProductsOrder();
    this.loadOrderRicevuti(this.homeComp.statoOrd);
  }

  loadOrderDetails(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (data) => {
        this.ordine = data;
        this.homeComp.showtable = false;
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  loadProductsOrder(): void {
    this.productService.getListaProdottiByIdOrder(this.id).subscribe(
      (data) => {
        this.products = data;
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }

  loadOrderRicevuti(stato: string) {
    this.orderService.getOrdersByStato(stato).subscribe(
      (data) => {
        this.orders = data;
        console.log('ddddd', this.orders);
      },
      (error) =>
        console.error("Errore nel recupero dei dettagli dell'ordine:", error)
    );
  }
  chiudiModale(){
    this.mostraModale = false;
  }
}
