import {
  AfterContentInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Order } from '../../models/Order';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  valoreselectmagg: string | undefined;
  valoreselectmin: string | undefined;

  stiletab(totale: number): { [klass: string]: any } | null | undefined {
    if (totale < parseInt(this.valoreselectmin!)) {
      return { color: 'red', 'font-weight': 'bold' };
    } else if (totale > parseInt(this.valoreselectmagg!)) {
      return { color: 'green', 'font-weight': 'bold' };
    }
    return {};
  }
  sidebarActive = false;
  orders: Order[] = [];
  showtable = true;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.caricaOrdini();

    this.orderService.refreshData$.subscribe(() => {
      this.caricaOrdini();
    });
  }

  caricaOrdini() {
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

  showFormInserimentoOrdine() {
    this.router.navigate(['home/inserimento-ordine']);
    this.sidebarActive = this.sidebarActive ? false : this.sidebarActive;
    this.showtable = false;
  }

  aggiornaForm(id: number) {
    this.router.navigate(['home/aggiorna-ordine', id]);
    this.showtable = false;
  }

  elimina(id: number) {
    const confirmed = window.confirm('Sicuro sicuro???');
    if (confirmed) {
      this.orderService.eliminaOrdine(id).subscribe(
        (data) => {
          alert('Ordine eliminato con successo');
          console.log(data);
          this.caricaOrdini();
        },
        (error) =>
          console.error("Errore nel recupero dei dettagli dell'ordine:", error)
      );
    }
  }
}
