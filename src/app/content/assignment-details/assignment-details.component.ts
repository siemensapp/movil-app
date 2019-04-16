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
  basemapType = 'topo';
  mapZoomLevel = 16;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }


  constructor(private componentsComms: ComponentsCommsService, private router: Router) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('dataAssignment'));
    this.componentsComms.setBackStatus(true);
  }
  
  // Expande y minimiza el mapa
  fullScreenMap() {
    let map = document.getElementById("map-container")
    let btn = document.getElementById("expandBtn");
    let details = document.getElementById("details");

    map.style.height = (this.fullMap) ? "40vh" : "100vh";    
    btn.style.top = (this.fullMap) ? "37vh" : "85vh";
    btn.innerHTML = (this.fullMap) ? "<i class='fas fa-expand'></i>" : "<i class='fas fa-compress'></i>";
    details.style.display = (this.fullMap) ? "block" : "none";
    this.fullMap = !this.fullMap;
  }

}
