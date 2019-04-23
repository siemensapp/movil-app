import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit {
  data = null;

  // Set our map properties
  mapCenter = [-74.183888, 4.777068];
  basemapType = 'dark-gray';
  mapZoomLevel = 16;

  // Hour table
  hours = null;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }


  constructor(private componentsComms: ComponentsCommsService, private router: Router) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('dataAssignment'));
    this.componentsComms.setBackStatus(true);
    this.hours = this.componentsComms.getHours();
  }
  
  

}
