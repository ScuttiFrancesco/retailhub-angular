import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-avviso',
  standalone: false,

  templateUrl: './avviso.component.html',
  styleUrl: './avviso.component.css',
})
export class AvvisoComponent {
  @Input() visibile = false;

  @Input() messaggioModale: string = '';

  @Output() chiudiModal = new EventEmitter<void>(); // Evento per chiudere la modale

  chiudi() {
    this.chiudiModal.emit();
  }
}
