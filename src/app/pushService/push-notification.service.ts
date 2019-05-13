import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from '../../assets/js/variables';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient) { }

  sendSubscription( subscription: PushSubscription) {
    console.log(subscription);
    return this.http.post( url + '/api/subscription', subscription );
  }

}
