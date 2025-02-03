import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/Order';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Prodotto } from '../../models/Prodotto';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dettagli-ordine',
  standalone: false,
  
  templateUrl: './dettagli-ordine.component.html',
  styleUrl: './dettagli-ordine.component.css'
})
export class DettagliOrdineComponent implements OnInit {

  products: Prodotto[] = [];
  private id : number = -1
  ordine: Order | undefined;
  constructor(private orderService: OrderService, private route: ActivatedRoute, private productService : ProductService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.loadOrderDetails();
      this.loadProductsOrder();
    });
  }

  loadOrderDetails(): void {
    this.orderService.getOrderById(this.id).subscribe(
      (data) => {
        this.ordine = data;       
      },
      (error) => console.error('Errore nel recupero dei dettagli dell\'ordine:', error)
    );
  }

  loadProductsOrder(): void {
    this.productService.getListaProdottiByIdOrder(this.id).subscribe(
      (data) => {
        this.products = data;        
      },
      (error) => console.error('Errore nel recupero dei dettagli dell\'ordine:', error)
    );
  }

  }
  
 


