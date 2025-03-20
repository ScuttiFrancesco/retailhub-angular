import { Component, OnInit } from '@angular/core';
import { MqttsService } from './services/mqtt.service';
import { MqttInsert } from './models/MqttInsert';
import { IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject } from 'rxjs';
import { OrderService } from './services/order.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'progetto-pr';
  topic = 'inserisci-ordine';
  showAvviso = false;
  messaggioModale = '';

  constructor(
    private mqttService: MqttsService,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.detectMqtt();
    this.notificationService.currentMessage.subscribe(message => this.messaggioModale = message);
    this.notificationService.currentVisibility.subscribe(visible => this.showAvviso = visible);
  }

  detectMqtt() {
    this.mqttService.topicSubscribe(this.topic).subscribe({
      next: (message: IMqttMessage) => {
        const payload: MqttInsert = JSON.parse(message.payload.toString());
        console.log('mqttMex: ', payload);
        this.orderService.insertOrderMqtt(payload);        
      },
      error: (error: Error) => {
        this.showAvviso = true;
        this.messaggioModale = error.message;
      },
    });
  }

  chiudiModale() {
    this.showAvviso = false;
  }
}
