
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
  basemapType = 'streets-navigation-vector';
  mapZoomLevel = 14;
  siteMarker = [-74.183888, 4.777068];

  // Hour table
  hours = null;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  parseDate(date1, date2) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    let sameYearDates = String(meses[dateOne.getMonth()] + ' ' + dateOne.getDate() + ' - ' + meses[dateTwo.getMonth()] + ' ' + dateTwo.getDate());
    let diffYearDates = String(meses[dateOne.getMonth()] + ' ' + dateOne.getDate() + ' ' + dateOne.getFullYear() + ' - ' + meses[dateTwo.getMonth()] + ' ' + dateTwo.getDate() + ' ' + dateTwo.getFullYear());
    return ( dateOne.getFullYear() == dateTwo.getFullYear() ) ? sameYearDates: diffYearDates; 
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

  writeReport(){
    document.getElementById("reportsMenu").classList.toggle("show");
  }

  
  

}
