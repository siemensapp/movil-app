import { Injectable } from '@angular/core';
import * as env from '../assets/js/variables';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {

  constructor() {}

  connectionExists() {
    return new Promise(resolve => {
      var xhr = new XMLHttpRequest();
      var file = env.url + '/api/workers'
      var randomNum = Math.round(Math.random() * 10000);
 
      xhr.open('HEAD', file + "?rand=" + randomNum, true);
      xhr.send();
     
      xhr.addEventListener("readystatechange", processRequest, false);
 
      function processRequest(e) {
        if (xhr.readyState == 4) {
          resolve((xhr.status >= 200 && xhr.status < 304)? true : false );
        }
      }
    })  
  }


}
