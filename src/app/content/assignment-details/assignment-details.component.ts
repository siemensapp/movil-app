
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
  private fullMap = false;

  // Set our map properties
  mapCenter = [-74.183888, 4.777068];
  basemapType = 'streets-navigation-vector';
  mapZoomLevel = 14;

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
    this.componentsComms.setBackStatus(true);
  }

  writeReport(){
    document.getElementById("reportsMenu").classList.toggle("show");
  }

  
  // Expande y minimiza el mapa
  // fullScreenMap() {
  //   let map = document.getElementById("map-container")
  //   let btn = document.getElementById("expandBtn");
  //   let details = document.getElementById("details");

  //   map.style.height = (this.fullMap) ? "40vh" : "100vh";    
  //   btn.style.top = (this.fullMap) ? "37vh" : "85vh";
  //   btn.innerHTML = (this.fullMap) ? "<i class='fas fa-expand'></i>" : "<i class='fas fa-compress'></i>";
  //   details.style.display = (this.fullMap) ? "block" : "none";
  //   this.fullMap = !this.fullMap;
  // }

}
