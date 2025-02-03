import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Order } from '../../models/Order';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  

  sidebarActive = false;
  orders: Order[] = [];
  showtable = true;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orderService.getOrdersByStato('RICEVUTO').subscribe(
      (data) => {
        this.orders = data;
        console.log('Ordini:', this.orders);
      },
      (error) => console.error('Errore nel recupero ordini:', error)
    );
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  showOrderDetails(id: number) {
    this.router.navigate(['home/dettagli-ordine', id]);
    this.showtable = false;
  }

  showTableView() {
    this.showtable = true;
    this.sidebarActive = !this.sidebarActive;
    }
}
