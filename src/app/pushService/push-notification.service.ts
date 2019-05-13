import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from '../../assets/js/variables';
import { HttpRequestsService } from "../http-requests.service";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpRequestsService) { }

  sendSubscription( subscription: PushSubscription) {
    console.log(subscription);
    console.log(url + '/api/subscription');
    return this.http.postData( url + '/api/subscription', JSON.stringify(subscription) ) ;
  }

}
