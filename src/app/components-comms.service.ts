import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsCommsService {
  // Back button
  private backSource = new BehaviorSubject(false);
  back = this.backSource.asObservable();

  // Hoja horas
  private hoursSource = new BehaviorSubject([]);
  hours = this.hoursSource.asObservable();

  // Dice si usar back button
  setBackStatus( data: boolean ) {
    this.backSource.next(data);
  }
  
  getBackStatus() {
    return this.back['source']['value'];
  }

  // Define y trae los datos de la asignacion
  setDataAssignment( data:JSON ) {
    localStorage.setItem('dataAssignment', JSON.stringify(data));
  }

  getDataAssignment() {
    return JSON.parse(localStorage.getItem('dataAssignment'));
  }

  deleteDataAssignment() {
    localStorage.removeItem('dataAssignment');
  }

  /* Funciones horas */
  getHours() {
    return this.hours;
  }

  setHours( data ) {
    this.hoursSource.next(data);
  }

}
