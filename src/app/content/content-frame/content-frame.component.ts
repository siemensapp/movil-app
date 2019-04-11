import {Component,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-frame',
  templateUrl: './content-frame.component.html',
  styleUrls: ['./content-frame.component.css']
})
export class ContentFrameComponent implements OnInit {

  constructor(private router: Router) {}
  private openSource = new BehaviorSubject(false);
  open = this.openSource.asObservable();
  openedbefore = false;

  ngOnInit() {
    this.open.subscribe(data => {
      if (data) {
        if (!this.openedbefore) {
          this.openedbefore = true;
        }
        //document.getElementById("side-menu-body").style.borderRight = "1px solid lightgray";
        document.getElementById("side-menu-body").style.width = "60%";
        document.getElementById("side-menu-body").style.zIndex = "50";
        document.getElementById("openMenuBtn").style.transitionDelay = "0s";
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      } else {
        if (this.openedbefore) {
          document.getElementById("openMenuBtn").style.transitionDelay = "0.3s";
        }
        // document.getElementById("openMenuBtn").style.zIndex = "1";
      }
    })
  }

  openMenu() {
    this.openSource.next(true);
  }

  closeMenu() {
    document.getElementById("side-menu-body").style.width = "0";
    document.body.style.backgroundColor = "white";
    this.openSource.next(false);
  }

  logout() {
    localStorage.setItem('user', null);
    setTimeout(()=> {
      document.body.style.backgroundColor = "white";
      this.router.navigate(["login"]);
    }, 1000);
    
  }

}
