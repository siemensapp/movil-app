import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  // private textAreas = [ 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes', 'anexos' ];
  private textAreas = [ 'descripcionAlcance' ];

  constructor() { }

  ngOnInit() {
    this.resizeTextArea();
  }

  resizeTextArea() {
    for (let id of this.textAreas) {
      let item = document.getElementById(id);
      item.addEventListener('keydown', () => {
        if (item.scrollTop != 0) {
          console.log("scrollHeight",item.scrollHeight + "px");
          console.log("scrollTop",item.scrollTop + "px");
          item.style.height = "auto";
          item.style.height = item.scrollHeight + "px";
        };
      })
    }
  }


}
