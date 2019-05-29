import {Component,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {Location} from '@angular/common';
import { ComponentsCommsService } from '../../components-comms.service';

@Component({
  selector: 'app-content-frame',
  templateUrl: './content-frame.component.html',
  styleUrls: ['./content-frame.component.css']
})
export class ContentFrameComponent implements OnInit {

  constructor(private router: Router, private componentComms: ComponentsCommsService, private location: Location) {
    this.subscribeRouteChanges();
  }


  private openSource = new BehaviorSubject(false);
  open = this.openSource.asObservable();
  private coordsSource = new BehaviorSubject(false);
  coords = this.coordsSource.asObservable();
  openedbefore = false;

  Foto = "";
  NombreE = "";

  ngOnInit() {

    this.Foto = localStorage.getItem('Foto');
    this.NombreE = localStorage.getItem("NombreE");   
    this.componentComms.back.subscribe( result => {
      if (result) {
        document.getElementById("navbar-title").innerHTML = "<i class='fas fa-arrow-left'></i>";        
      }
      else {
        document.getElementById("navbar-title").innerHTML = "<i class='fas fa-bars'></i>";        
      }
    })

    this.open.subscribe(data => {
      if (data) {
        if (!this.openedbefore) {
          this.openedbefore = true;
        }
        // document.getElementById("side-menu-background").style.width = "100%";
        document.getElementById("side-menu-body").style.width = "400px";
        // document.getElementById("obscuring").style.zIndex = "60";
        document.getElementById("side-menu-body").style.zIndex = "50";
        document.getElementById("navbar-title").style.transitionDelay = "0s";
        document.getElementById("obscuring").style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        //document.body.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      } else {
        if (this.openedbefore) {
          document.getElementById("navbar-title").style.transitionDelay = "0.3s";
        }
      }
    })
  }

  menuFunction() {
    if (this.componentComms.getBackStatus()) {
      this.location.back();
    } else this.openSource.next(true);
  }

  closeMenu() {
    document.getElementById("side-menu-background").style.width = "0";
    document.getElementById("side-menu-body").style.width = "0";
    document.getElementById("obscuring").style.backgroundColor = "white";
    this.openSource.next(false);
  }

  checkNavbarColors() {
    var navbar = document.getElementById('navbar');
    var btn = document.getElementById('navbar-title');
    var url = window.location.href;
    if (url.includes("hours")) {
      console.log("includes")
      navbar.style.backgroundColor = "#006486";
      btn.style.backgroundColor = "#006486";
      btn.style.color = 'white';
    } else {
      console.log("doesnt includes")
      navbar.style.backgroundColor = "inherit";
      btn.style.backgroundColor = "inherit";
      btn.style.color = 'black';
    }
  }

  dynamicNavbar( url ) {
    var navbar = document.getElementById('navbar');
    var btn = document.getElementById('navbar-title');
    if (url.includes('list')) {

    }
  }

  subscribeRouteChanges() {
      this.router.events.subscribe((route) => {
        if(route) console.log(window.location.href)
      })
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('Foto');
    localStorage.removeItem('NombreE');
    localStorage.removeItem('token');
    setTimeout(()=> {
      document.body.style.backgroundColor = "white";
      this.router.navigate(["login"]);
    }, 1000);
    
  }

}
