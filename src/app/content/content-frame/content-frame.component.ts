import {Component,OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ComponentsCommsService} from '../../components-comms.service';

@Component({
  selector: 'app-content-frame',
  templateUrl: './content-frame.component.html',
  styleUrls: ['./content-frame.component.css']
})
export class ContentFrameComponent implements OnInit {

  constructor(private componentsComms: ComponentsCommsService) {}
  private openSource = new BehaviorSubject(false);
  open = this.openSource.asObservable();
  openedbefore = false;

  ngOnInit() {
    this.open.subscribe(data => {
      if (data) {
        if (!this.openedbefore) {
          this.openedbefore = true;
        }
        document.getElementById("side-menu-body").style.width = "60%";
        document.getElementById("side-menu-body").style.zIndex = "50";
        document.getElementById("openMenuBtn").style.transitionDelay = "0s";
        document.getElementById("openMenuBtn").style.zIndex = "-1";
      } else {
        if (this.openedbefore) {
          document.getElementById("openMenuBtn").style.transitionDelay = "0.3s";
        }
        document.getElementById("openMenuBtn").style.zIndex = "1";
      }
    })
  }

  openMenu() {
    this.openSource.next(true);
  }

  closeMenu() {
    document.getElementById("side-menu-body").style.width = "0";
    this.openSource.next(false);
  }

}
