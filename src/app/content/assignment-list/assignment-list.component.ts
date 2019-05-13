import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../../http-requests.service';
import { ComponentsCommsService } from '../../components-comms.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { url } from '../../../assets/js/variables';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from "../../pushService/push-notification.service";


@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  private user = "";
  loadingData = new Subject();

  private VAPID_PUBLIC = "BEwOkuB14wZmYFcToortGXoFqc6HO_aXhhn_3mOU-h8B9x_z92pZ_WUpCExXt0cbCo61F1mJZ_D_vRgncaHvbSs";


  constructor(private pushService: PushNotificationService, private http: HttpRequestsService, private componentsComms: ComponentsCommsService, private router: Router, private swPush: SwPush) { }

  ngOnInit() {
    this.notificationsCheck();
    this.componentsComms.setBackStatus(false);
    this.getData();
  }


  // Funcion para verificar si navegador puede usar service-workers
  notificationsCheck() {
    if( this.swPush.isEnabled ) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC
      }).then( subscription => {
          this.pushService.sendSubscription(subscription);
      }).catch(console.error)
    }
  }

  goToDetails( data:JSON ) {
    this.componentsComms.setDataAssignment(data);
    this.router.navigate(["home/details"]);
  }

  getData() {
    this.user = localStorage.getItem('user');
    this.http.getData(url + "/api/getWorkerAssignments/" + this.user).then( result =>{
      console.log(result);
      this.loadingData.next(result);
    });     
  }

  

}
