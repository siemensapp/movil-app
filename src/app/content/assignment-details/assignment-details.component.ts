import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit {
  data = null;

  // Set our map properties
  mapCenter = [-74.183888, 4.777068];
  basemapType = 'topo';
  mapZoomLevel = 16;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  constructor(private componentsComms: ComponentsCommsService) { }

  ngOnInit() {
    this.data = this.componentsComms.getDataAssignment().source.value;
  }

}
