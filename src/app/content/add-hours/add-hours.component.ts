import { Component, OnInit } from '@angular/core';
import * as TinyDatePicker from 'tiny-date-picker';


@Component({
  selector: 'app-add-hours',
  templateUrl: './add-hours.component.html',
  styleUrls: ['./add-hours.component.css']
})
export class AddHoursComponent implements OnInit {
  dp;

  constructor() { }

  showDatePicker() {
    this.dp.open();
  }

  ngOnInit() {
    this.dp = TinyDatePicker('#datepicker', {
      mode: 'dp-modal'
    });
  }

}
