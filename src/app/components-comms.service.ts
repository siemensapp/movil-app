import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsCommsService {

  // Comunica los botones de abrir y cerrar el menu lateral
  private openMenuSource = new BehaviorSubject(false);
  open = this.openMenuSource.asObservable();
  openedbefore = false;

  constructor() { }

  //Funcion que cambia el bool 'bandera', indica si esta abierto el menu
  openMenu() {
    this.openMenuSource.next(true);
  }

  //Funcion que cambia el bool 'bandera', indica si esta cerrado el menu
  closeMenu() {
    this.openMenuSource.next(false);
  }
}
