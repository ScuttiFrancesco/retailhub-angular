import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private messageSource = new BehaviorSubject<string>('');
  private visibilitySource = new BehaviorSubject<boolean>(false);

  currentMessage = this.messageSource.asObservable();
  currentVisibility = this.visibilitySource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeVisibility(visible: boolean) {
    this.visibilitySource.next(visible);
  }
}
