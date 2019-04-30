import {Component,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { ComponentsCommsService } from '../../components-comms.service';

@Component({
  selector: 'app-content-frame',
  templateUrl: './content-frame.component.html',
  styleUrls: ['./content-frame.component.css']
})
export class ContentFrameComponent implements OnInit {

  constructor(private router: Router, private componentComms: ComponentsCommsService, private location: Location) {}
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
        document.getElementById("openMenuBtn").innerHTML = "<i class='fas fa-arrow-left'></i>";        
      }
      else {
        document.getElementById("openMenuBtn").innerHTML = "<i class='fas fa-bars'></i>";        
      }
    })

    this.open.subscribe(data => {
      if (data) {
        if (!this.openedbefore) {
          this.openedbefore = true;
        }
        // document.getElementById("side-menu-background").style.width = "100%";
        document.getElementById("side-menu-body").style.width = "400px";
        // document.getElementById("side-menu-body").style.zIndex = "49";
        document.getElementById("side-menu-body").style.zIndex = "50";
        document.getElementById("openMenuBtn").style.transitionDelay = "0s";
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      } else {
        if (this.openedbefore) {
          document.getElementById("openMenuBtn").style.transitionDelay = "0.3s";
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
    document.body.style.backgroundColor = "white";
    this.openSource.next(false);
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
