import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit {
  data = null;


  constructor(private componentsComms: ComponentsCommsService) { }

  ngOnInit() {
    this.data = JSON.stringify(this.componentsComms.getDataAssignment());
  }

}
