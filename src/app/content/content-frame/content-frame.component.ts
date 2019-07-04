import {Component,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import {Location} from '@angular/common';
import { ComponentsCommsService } from '../../components-comms.service';
import 'rxjs/add/operator/filter';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-content-frame',
  templateUrl: './content-frame.component.html',
  styleUrls: ['./content-frame.component.css']
})
export class ContentFrameComponent implements OnInit {

  constructor(private router: Router, private componentComms: ComponentsCommsService, private location: Location) {
    this.subscribeRouteChanges();
    this.subscribeLastURL();
  }


  private openSource = new BehaviorSubject(false);
  open = this.openSource.asObservable();
  private coordsSource = new BehaviorSubject(false);
  coords = this.coordsSource.asObservable();
  openedbefore = false;

  Foto = "";
  NombreE = "";
  lastURL = "";

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
      let url = window.location.href;
      if (url.includes('details')) this.router.navigate(['home/assignments-list']);
      else if (url.includes('reports-list')) this.router.navigate(['home/details']);
      else if (url.includes('report')) this.router.navigate(['home/reports-list']);
      else if (url.includes('hours')) this.router.navigate(['home/report']);
    } else this.openSource.next(true);
  }

  closeMenu() {
    document.getElementById("side-menu-background").style.width = "0";
    document.getElementById("side-menu-body").style.width = "0";
    document.getElementById("obscuring").style.display = "none";
    this.openSource.next(false);
  }

  rightButtonFunction() {
    var url = window.location.href;
    if (url.includes('hours')) {
      Swal.fire({
        title: 'Eliminar fecha',
        text: 'Si borras toda la fecha perderas todas sus horas asociadas.',
        type: 'warning',
        confirmButtonText: 'Eliminar',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar'}).then(() => {
          var hours = this.componentComms.getHours();
          var date = localStorage.getItem('dateToChange');
          console.log('hours: ', hours);
          delete hours[date];
          console.log('changed hours: ', hours );
          this.componentComms.setHours(hours);
          Swal.fire({type: "success", title: "Exito", text: 'Hora guardada'})
          .then(() => { 
            this.router.navigate(['home/report']);
            localStorage.removeItem('dateToChange');
          });  
      })
    } else if (url.includes('details')) {
        let navbarbuttonright = document.getElementById('navbar-right-button');
        let mapOpen = this.componentComms.getDetailsMapStatus();
        this.componentComms.setDetailsMapStatus( !mapOpen );
        navbarbuttonright.style.outline = (!mapOpen)? "solid 1px black" : "none";
    }
  }

  dynamicNavbar( url ) {
    var navbar = document.getElementById('navbar');
    var navbartitle = document.getElementById('navbar-title');
    var navbarbutton = document.getElementById('navbar-button');
    var navbarbuttonright = document.getElementById('navbar-right-button');
    var title;
    var buttonicon;
    var buttoniconright;

    if (url.includes('assignments-list')) {
      title = "Asignaciones";
      buttonicon = "<i class='fas fa-bars'></i>";
      navbarbuttonright.style.display = "none";
      navbar.style.boxShadow = "none";
    }
    else if (url.includes('details')) {
      title = "Detalles";
      buttonicon = "<i class='fas fa-arrow-left'></i>"
      buttoniconright = '<i class="fas fa-map-marked-alt"></i>'
      navbarbuttonright.style.display = "inline";
    }
    else if (url.includes('reports-list')) {
      title = "Reportes";
      buttonicon = "<i class='fas fa-arrow-left'></i>"
      navbarbuttonright.style.display = "none";
    }
    else if (url.includes('report')) {
      title = "Reporte general";
      buttonicon = "<i class='fas fa-arrow-left'></i>"
      buttoniconright = '<i class="fas fa-file-upload"></i>';
      navbarbuttonright.style.display = "inline";
    }    
    else if (url.includes('hours')) {
      title = 'Hoja de horas';
      buttonicon = "<i class='fas fa-arrow-left'></i>"
      buttoniconright = '<i class="fas fa-trash"></i>';
      navbarbuttonright.style.display = "inline";
      navbar.style.boxShadow = "none";
    }
    navbartitle.innerHTML = title;
    navbarbutton.innerHTML = buttonicon;
    navbarbuttonright.innerHTML = buttoniconright;
  }

  subscribeRouteChanges() {
      // Detecta cambios en la ruta para adaptar el estilo de navbar dinamicamente
      this.router.events.subscribe((route) => {
        if(route) this.dynamicNavbar(window.location.href);
      })
  }

  subscribeLastURL() {
    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd) {
        console.log('lastURL :', this.lastURL)
        localStorage.setItem('lastURL', this.lastURL);
        this.lastURL = event.url;
      }      
    });
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
