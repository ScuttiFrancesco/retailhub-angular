import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import L from 'leaflet';
import { GeocodingService } from '../../services/geocoding.service';
import { NegozioService } from '../../services/negozio.service';
import { Negozio } from '../../models/Negozio';
import { forkJoin, map } from 'rxjs';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-mappa',
  standalone: false,

  templateUrl: './mappa.component.html',
  styleUrl: './mappa.component.css',
})
export class MappaComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @ViewChild('popupContent') popupContent!: ElementRef;

  private map!: L.Map;
  lat: number = 41.820172;
  long: number = 12.469372;
  listaNegozi: Negozio[] = [];

  constructor(
    private geocodingService: GeocodingService,
    private negozioService: NegozioService,
    private router: Router,
    private homeComponent: HomeComponent
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getLeafletMap();
    }, 1000);
    this.negozioService.getListaNegozi().subscribe({
      next: (data) => {
        this.listaNegozi = data;
        console.log(this.listaNegozi);
      },
    });
  }

  getLeafletMap() {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.log('Elemento contenitore della mappa non trovato.');
      return;
    }
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.lat, this.long],
      zoom: 13,
    });

    const customIcon = new L.Icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.addMarkersForNegozi();
  }

  isLoading: boolean = false;

  addMarkersForNegozi() {
    this.isLoading = true;
    const geocodingRequests = this.listaNegozi.map((negozio) =>
      this.geocodingService
        .getCoordinates(`${negozio.indirizzo}, ${negozio.sede}`)
        .pipe(
          map((coords) => ({
            coords,
            negozio,
          }))
        )
    );

    forkJoin(geocodingRequests).subscribe({
      next: (results) => {
        results.forEach((result) => {
          const [lat, lng] = result.coords;
          const customIcon = new L.Icon({
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          const popupContent = this.popupContent.nativeElement.innerHTML;

          L.marker([lat, lng], { icon: customIcon })
            .bindPopup(popupContent)
            .on('popupopen', () => {
              // Cerchiamo il bottone nel DOM del popup
              const btn = document.querySelector('.popup-button');
              if (btn) {
                btn.addEventListener('click', () => {
                  this.home();
                });
              }
            })
            .addTo(this.map);
        });

        const bounds = L.latLngBounds(results.map((r) => r.coords));
        this.map.fitBounds(bounds);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel geocoding:', error);
        this.isLoading = false;
      },
    });
  }

  home() {
    this.homeComponent.showtable = true;
    this.homeComponent.showTitle = true;
    this.router.navigate(['/home']);
  }
}
