import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/Order';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-grafici',
  standalone: false,
  templateUrl: './grafici.component.html',
  styleUrl: './grafici.component.css',
})
export class GraficiComponent {
  @ViewChild('myChart') myChart: ElementRef | undefined;

  constructor(private router: Router, private homeComp :HomeComponent) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orders = navigation.extras.state['orders'];
    }
  }

  ngOnInit(): void {
    this.prepareChartData();
    console.log(this.orders[2].dataOrdine?.substring(3, 5));
  }

  prepareChartData(): void {
    // Array di tutti i mesi
    const mesi = [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ];

    // Raggruppa i dati per mese
    let tot: number = 0;
    const groupedData: { [key: number]: number } = {}; // Usa l'indice del mese come chiave
    this.orders.forEach((order) => {
      const mese: string = order.dataOrdine!.substring(3, 5);
      for (let index = 0; index < 12; index++) {
        if (index === parseInt(mese) - 1) {
          console.log(tot);
          tot += order.totale!;
          groupedData[index] = tot;
        }
      }
    });

    // Completa i dati per tutti i mesi
    this.chartData = mesi.map((mese, index) => ({
      name: mese,
      value: groupedData[index] || 0, // Usa 0 se il mese non ha ordini
    }));
  }

  orders: Order[] = [];
  chartData: any[] = [];
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
  home(){
    this.router.navigate(['home']);
    this.homeComp.showtable = true;
  }
}
