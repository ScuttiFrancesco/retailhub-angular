import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<[number, number]> {
    const encodedAddress = encodeURIComponent(address);
    return this.http
      .get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`)
      .pipe(
        map((response: any) => {
          if (response && response.length > 0) {
            return [parseFloat(response[0].lat), parseFloat(response[0].lon)];
          }
          throw new Error('Indirizzo non trovato');
        })
      );
  }
}