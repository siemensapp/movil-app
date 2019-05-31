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

    this.open.subscribe(data => {
      if (data) {
        if (!this.openedbefore) {
          this.openedbefore = true;
        }        
        document.getElementById("side-menu-body").style.width = "250px";        
        document.getElementById("side-menu-body").style.zIndex = "50";                
        document.getElementById("obscuring").style.zIndex = "49";
        document.getElementById("obscuring").style.display = "inline";
      } 
    })
  }

  menuFunction() {
    if (this.componentComms.getBackStatus()) {
      this.location.back();
      let url = window.location.href;
      if (url.includes('details')) this.router.navigate(['home/list']);
      else if (url.includes('report')) this.router.navigate(['home/details']);
      else if (url.includes('hours')) this.router.navigate(['home/report']);
    } else this.openSource.next(true);
  }

  closeMenu() {
    document.getElementById("side-menu-background").style.width = "0";
    document.getElementById("side-menu-body").style.width = "0";
    document.getElementById("obscuring").style.display = "none";
    this.openSource.next(false);
  }

  dynamicNavbar( url ) {
    var navbar = document.getElementById('navbar');
    var navbartitle = document.getElementById('navbar-title');
    var navbarbutton = document.getElementById('navbar-button');
    var title;
    var buttonicon;

    if (url.includes('list')) {
      title = "Asignaciones";
      buttonicon = "<i class='fas fa-bars'></i>"
    }
    else if (url.includes('details')) {
      title = "Detalles";
      buttonicon = "<i class='fas fa-arrow-left'></i>"
    }
    else if (url.includes('report')) {
      title = "Reporte general";
      buttonicon = "<i class='fas fa-arrow-left'></i>"
    }
    else if (url.includes('hours')) {
      title = 'Hoja de horas';
      buttonicon = "<i class='fas fa-arrow-left'></i>"
      navbar.style.boxShadow = "none";
    }
    navbartitle.innerHTML = title;
    navbarbutton.innerHTML = buttonicon;
  }

  subscribeRouteChanges() {
      this.router.events.subscribe((route) => {
        if(route) this.dynamicNavbar(window.location.href);
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
