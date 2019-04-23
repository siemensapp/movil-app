import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  private textAreas = [ 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes' ];
  //private textAreas = [ 'descripcionAlcance' ];
  hours = [];

  constructor(private componentComms: ComponentsCommsService) { }

  ngOnInit() {
    this.componentComms.setBackStatus(true);
    this.hours = this.componentComms.getHours()['hours'];
    this.resizeTextArea();
  }

  resizeTextArea() {
    for (let id of this.textAreas) {
      let item = document.getElementById(id);
      item.addEventListener('keydown', () => {
        if (item.scrollTop != 0) {
          item.style.height = item.scrollHeight + "px";
        };
      })
    }
  }


}
