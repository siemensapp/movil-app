import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  constructor() { }

  closeMenu() {
    document.getElementById("side-menu-body").style.width = "0px";
  }

  ngOnInit() {
  }

}
