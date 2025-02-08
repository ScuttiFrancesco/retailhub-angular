import { Component, OnInit } from '@angular/core';
import { MqttsService } from '../../services/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Cliente } from '../../models/Cliente';

@Component({
  selector: 'app-modal',
  standalone: false,

  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  constructor(private mqttService: MqttsService) {}

  messaggi: Cliente[] = [];

  ngOnInit(): void {
  //  this.sottoScrivi();
  }
/*
  sottoScrivi() {
    this.mqttService
      .topicSubscribe('messaggi/avvisi/#')
      .subscribe((message: IMqttMessage) => {        
       const paidLoad = JSON.parse(message.payload.toString());
       this.messaggi.push(paidLoad);
       console.log(this.messaggi);
      });
  }*/
}
