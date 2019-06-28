import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsCommsService {

  // Back button
  private backSource = new BehaviorSubject(false);
  back = this.backSource.asObservable();

  // Right navbar button
  private rightNavBtnSource = new BehaviorSubject(false);
  rightNavBtn = this.rightNavBtnSource.asObservable();

  // Hoja horas
  private hoursSource = new BehaviorSubject([]);
  hours = this.hoursSource.asObservable();

  //Boolean para tomar coordenadas cuando se empiece un servicio
  private startSource = new BehaviorSubject('');
  start = this.startSource.asObservable();

  // Para abrir y cerrar el mapa en assignment-details
  setDetailsMapStatus( data:boolean ) {
    this.rightNavBtnSource.next(data);
  }

  getDetailsMapStatus() {
    return this.rightNavBtn['source']['value'];
  }


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
    //localStorage.removeItem('hours');
    let hours = localStorage.getItem('hours');    
    // return (hours !== null) ? JSON.parse(hours) : {};
    return JSON.parse(hours);
  }

  setHours(hours) {
    localStorage.setItem('hours', JSON.stringify(hours));
  }

  /* Funcion get nombre Especialista */
  getNameE() {
    return localStorage.getItem('NombreE');
  }

  
  /* Funciones coordenadas */

  getCurrentCords ( statusId ) {
    this.startSource.next(statusId);
  }
}
