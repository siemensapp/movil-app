import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { SaveIDBService } from '../../save-idb.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit {
  loadingData = new Subject();

  constructor(private componentComms:ComponentsCommsService, private idb: SaveIDBService) { }

  ngOnInit() {
    this.componentComms.setBackStatus(true);
    this.getReportsFromAssignment();
  }

  getReportsFromAssignment() {
    this.idb.getAllReports(this.idb.nuevoConsecutivo()).then( result => {
      console.log('Inside getReportsFromAssignment:', result);
      this.loadingData.next(result);
    })
  }


}
