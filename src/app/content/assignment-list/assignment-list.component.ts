import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../../http-requests.service';
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


  constructor(private http: HttpRequestsService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.user = localStorage.getItem('user');
    this.http.getData(url + "/api/getWorkerAssignments/" + this.user).then( result =>{
      setTimeout(() => {
        console.log(result);
        this.loadingData.next(result);
      }, 3000)
    });     
  }

  

}
