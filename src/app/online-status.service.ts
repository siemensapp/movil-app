import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {

  private onlineStatus = new Subject<boolean>();

  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  get connectionChanged() {
    return this.onlineStatus.asObservable();
  }

  updateOnlineStatus() {
    this.onlineStatus.next(window.navigator.onLine);
  }

  get isOnline() {
    return !!window.navigator.onLine;
  }

}
