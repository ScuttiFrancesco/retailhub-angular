import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/Order';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MqttsService } from '../../services/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Messaggio } from '../../models/Messaggio';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  valoreselectmagg: string | undefined;
  valoreselectmin: string | undefined;
  statoOrd: string = 'RICEVUTO';
  statoOrdPlu: string = this.statoOrd.slice(0, -1) + 'I';
  sidebarActive = false;
  orders: Order[] = [];
  showtable = true;
  ordineList: string = 'data';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private mqtt: MqttsService
  ) {}

  showGrafici() {
    this.router.navigate(['home/grafici'], { state: { orders: this.orders } });
    this.showtable = false;
  }

  changeList() {
    switch (this.ordineList) {
      case 'data':
        this.orders.sort(
          (a, b) =>
            new Date(a.dataOrdine!).getTime() -
            new Date(b.dataOrdine!).getTime()
        );
        break;
      case 'cognomeCliente':
        this.orders.sort((a, b) =>
          a.cliente!.cognome!.localeCompare(b.cliente!.cognome!)
        );
        break;
      case 'cognomeOperatore':
        this.orders.sort((a, b) =>
          a.operatore!.cognome!.localeCompare(b.operatore!.cognome!)
        );
        break;
      case 'totaleAsc':
        this.orders.sort((a, b) => a.totale! - b.totale!);
        break;
      case 'totaleDesc':
        this.orders.sort((a, b) => b.totale! - a.totale!);
        break;
    }
  }

  //implementato cambio stato ordine con mex mqtt
  changeSelectMqtt() {/*
    this.mqtt
      .topicSubscribe('cambia/stato-ordine/#')
      .subscribe((message: IMqttMessage) => {
        const paidLoad: Messaggio = JSON.parse(message.payload.toString());
        this.statoOrd = paidLoad.statoOrdine.toUpperCase();
        this.caricaOrdini(this.statoOrd!);
        console.log(this.statoOrd);
      });

    this.mqtt.topicPublish(
      'risposta/stato-ordine',
      'Stato ordine aggiornato con successo'
    );
  */}

  changeSelect() {
    this.caricaOrdini(this.statoOrd!);
    this.statoOrdPlu = this.statoOrd.slice(0, -1) + 'I';
  }

  stiletab(totale: number): { [klass: string]: any } | null | undefined {
    if (totale < parseInt(this.valoreselectmin!)) {
      return { color: 'red', 'font-weight': 'bold' };
    } else if (totale > parseInt(this.valoreselectmagg!)) {
      return { color: 'green', 'font-weight': 'bold' };
    }
    return {};
  }

  ngOnInit(): void {
    this.caricaOrdini(this.statoOrd);
    this.changeSelectMqtt();
    this.orderService.refreshData$.subscribe(() => {
      this.caricaOrdini(this.statoOrd!);
    });
  }

  caricaOrdini(stato: string) {
    this.orderService.getOrdersByStato(stato).subscribe(
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

  showFormInserimentoCliente() {
    this.router.navigate(['inserimento-cliente']);
    this.sidebarActive = this.sidebarActive ? false : this.sidebarActive;
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
          this.caricaOrdini(this.statoOrd!);
        },
        (error) =>
          console.error("Errore nel recupero dei dettagli dell'ordine:", error)
      );
    }
  }
}
