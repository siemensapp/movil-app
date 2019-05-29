import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsCommsService {
  // Indexed DB
  private indexedDB =  null;


  // Back button
  private backSource = new BehaviorSubject(false);
  back = this.backSource.asObservable();

  // Hoja horas
  private hoursSource = new BehaviorSubject([]);
  hours = this.hoursSource.asObservable();

  //Boolean para tomar coordenadas cuando se empiece un servicio
  private startSource = new BehaviorSubject('');
  start = this.startSource.asObservable();

  
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
    return (hours !== null) ? JSON.parse(hours) : {};
  }

  /* Funcion get nombre Especialista */

  getNameE() {
    return localStorage.getItem('NombreE');
  }

  // setHoursDict( date1, date2 ) {
  //   const Date1 = new Date(date1);
  //   const Date2 = new Date(date2);
  //   const diffDate = Math.abs( Date2.getTime() - Date1.getTime() );
  //   const diffDays = Math.ceil( diffDate / (1000 * 60 * 60 * 24 ) );

  //   let hoursDict = {};
  //   console.log("Date 1:", date1);
  //   console.log("Date 2:", date2);

  //   for(let i=0; i < diffDays; i+=1) {
  //     let curDate = Date1.toISOString().split("T")[0];
  //     hoursDict[ curDate ] = {
  //       fecha: curDate,
  //       desde: "",
  //       hasta: "",
  //       descuento: "",
  //       servicioSitio: "",
  //       entrenamiento: "",
  //       tiempoViaje: "",
  //       tiempoEspera: ""
  //     }
  //     Date1.setDate(Date1.getDate() + 1);
  //   }
  //   localStorage.setItem('hours', JSON.stringify(hoursDict));
  //   return hoursDict;
  // }

  /* Funciones coordenadas */

  getCurrentCords ( statusId ) {
    this.startSource.next(statusId);
  }
}
