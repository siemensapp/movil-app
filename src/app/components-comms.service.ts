import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsCommsService {
  private backSource = new BehaviorSubject(false);
  back = this.backSource.asObservable();

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
}
