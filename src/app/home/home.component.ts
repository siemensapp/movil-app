import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../components-comms.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  constructor(private componentsComms: ComponentsCommsService) { }

  ngOnInit() {
    this.componentsComms.open.subscribe(data => {
      if(data) {
        if (!this.componentsComms.openedbefore) {
          this.componentsComms.openedbefore = true;
        }
        document.getElementById("openMenuBtn").style.transitionDelay = "0s";
        document.getElementById("openMenuBtn").style.zIndex = "-1";        
      } else {
        if (this.componentsComms.openedbefore) {
          document.getElementById("openMenuBtn").style.transitionDelay = "0.3s";  
        }
        document.getElementById("openMenuBtn").style.zIndex = "1";
      }
    })
  }

  openMenu() {
    this.componentsComms.openMenu();
  }

}
