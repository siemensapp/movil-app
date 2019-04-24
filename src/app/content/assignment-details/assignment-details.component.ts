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
  siteMarker = [-74.183888, 4.777068];

  // Hour table
  hours = null;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }


  constructor(private componentsComms: ComponentsCommsService, private router: Router) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('dataAssignment'));
    console.log(this.data);
    this.mapCenter = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.siteMarker = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.componentsComms.setBackStatus(true);
    this.hours = this.componentsComms.getHours();
  }
  
  

}
