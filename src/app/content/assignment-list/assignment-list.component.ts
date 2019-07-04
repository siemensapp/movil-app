import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../../http-requests.service';
import { ComponentsCommsService } from '../../components-comms.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { url } from '../../../assets/js/variables';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from '../../pushService/push-notification.service';
import { SaveIDBService } from '../../save-idb.service';
import { OnlineStatusService } from 'src/app/online-status.service';


@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  private user = "";
  loadingData = new Subject();

  private VAPID_PUBLIC = "BEwOkuB14wZmYFcToortGXoFqc6HO_aXhhn_3mOU-h8B9x_z92pZ_WUpCExXt0cbCo61F1mJZ_D_vRgncaHvbSs";


  constructor(private http: HttpRequestsService, private componentsComms: ComponentsCommsService, private router: Router, private swPush: SwPush, private pushService: PushNotificationService, private idb: SaveIDBService, private isOnline: OnlineStatusService) { }

  ngOnInit() {
    this.notificationsCheck();
    this.componentsComms.setBackStatus(false);
    this.getData();
    document.getElementById('0').style.display = 'block';
  }

  indicatorColor(num) {
    switch(num) {
      case 1:
        return 'gray';
      case 2:
        return '#006486';
      case 3: 
        return 'green';
    }
  }

  assignedPosition(status){
    if(status==0)
      return 'block';
    else
      return 'none';
  }

  assignedBorder(status){
    if(status==0)
      return '1px solid rgba(0, 0, 0, 0.2)';
    else
      return 'none';
  }

  acceptedPosition(status){
    if(status==1)
      return 'block';
    else
      return 'none';
  }

  acceptedBorder(status){
    if(status==1)
      return '1px solid rgba(0, 0, 0, 0.2)';
    else
      return 'none';
  }

  startedPosition(status){
    if(status==2)
      return 'block';
    else
      return 'none';
  }

  startedBorder(status){
    if(status==2)
      return '1px solid rgba(0, 0, 0, 0.2)';
    else
      return 'none';
  }

  endedPosition(status){
    if(status==3)
      return 'block';
    else
      return 'none';
  }

  endedBorder(status){
    if(status==3)
      return '1px solid rgba(0, 0, 0, 0.2)';
    else
      return 'none';
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

    this.isOnline.connectionExists().then( status => {
      if ( status ) {
        console.log('Online :)');
        this.http.getData(url + "/api/getWorkerAssignments/" + this.user).then( result =>{
          console.log(result);
          this.idb.saveAssignmentsLocally(result);
          this.loadingData.next(result);
        });     
      } else {
        console.log('Offline :(');
        this.idb.getAllAssignments().then( result => {
          console.log(result);
          this.loadingData.next(result);
        })
      }
    })


    
  }

  showAssignments(evt, status) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(status).style.display = "block";
    evt.currentTarget.className += " active";

  }
}
