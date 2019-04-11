import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../../http-requests.service';
import { ComponentsCommsService } from '../../components-comms.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { url } from '../../../assets/js/variables';


@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  private user = "";
  loadingData = new Subject();


  constructor(private http: HttpRequestsService, private componentsComms: ComponentsCommsService, private router: Router) { }

  ngOnInit() {
    this.getData();
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
