import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsCommsService {
  private dataAssignment = new BehaviorSubject(null);
  data = this.dataAssignment.asObservable();

  setDataAssignment( data:JSON ) {
    this.dataAssignment.next(data);
  }

  getDataAssignment() {
    return this.data;
  }
}
