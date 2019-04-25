import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  ngOnInit() {
    if ("orientation" in screen) {
      document.documentElement.requestFullscreen();
      screen.orientation.lock("portrait");
      // screen.msLockOrientation.lock("portrait-primary");
      // screen.mozLockOrientation.lock("portrait-primary");
    }
  }
}