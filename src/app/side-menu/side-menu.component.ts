import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../components-comms.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  constructor(private componentsComms: ComponentsCommsService) { }
  
  ngOnInit() {
    this.componentsComms.open.subscribe(data => {
      if(data) {
        document.getElementById("side-menu-body").style.width = "60%";
        document.getElementById("side-menu-body").style.zIndex = "50";
      } 
    })
  }

  closeMenu() {
    document.getElementById("side-menu-body").style.width = "0";
    this.componentsComms.closeMenu();
  }  

}
