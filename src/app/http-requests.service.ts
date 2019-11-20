import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'; 


@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  constructor(private http: HttpClient) { }

  postData( url: string, dataToSend: string ) {
    return new Promise( resolve => {
      this.http.post( url, JSON.parse(dataToSend) ).map( result => result).subscribe(dataReceived => {
        resolve(dataReceived);
      })
    })
  }

  getData( url:string ) {
    return new Promise( resolve => {
      this.http.get(url).map( result => result ).subscribe(dataReceived => {
        resolve(dataReceived);
      })
    })
  }

}
