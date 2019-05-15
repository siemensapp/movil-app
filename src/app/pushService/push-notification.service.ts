import { Injectable } from '@angular/core';
import { url } from '../../assets/js/variables';
import { HttpRequestsService } from "../http-requests.service";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpRequestsService) { }

  sendSubscription( subscription: PushSubscription) {
    console.log(subscription);
    console.log(url + '/api/subscriptionApp');
    return this.http.postData( url + '/api/subscriptionApp', JSON.stringify(subscription));
  }

}
