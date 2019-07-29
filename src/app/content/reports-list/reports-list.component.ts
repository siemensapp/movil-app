import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { SaveIDBService } from '../../save-idb.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit {
  loadingData = new Subject();
  nombreEmpresa;
  consecutivo;
  numeroReportes;

  constructor(private componentComms:ComponentsCommsService, private idb: SaveIDBService, private router: Router) { }

  ngOnInit() {
    this.componentComms.setBackStatus(true);
    this.getReportsFromAssignment();

    this.nombreEmpresa = this.componentComms.getDataAssignment()['NombreEmpresa'];
    this.consecutivo = this.idb.nuevoConsecutivo();
  }

  // Trae reportes desde IndexedDB
  getReportsFromAssignment() {
    this.idb.getAllReports(this.idb.nuevoConsecutivo()).then( result => {
      console.log('Inside getReportsFromAssignment:', result);
      this.numeroReportes = result.length;
      this.loadingData.next(result);
    })
  }
  // Ir al reporte
  goToReport( report ) {
    this.idb.loadReportLS(report);
    console.log('Reporte a Cargar: ', report);
    console.log('Report set in LS');
    this.router.navigate(["home/report"]);
  }

  // Mostrar boton de borrado
  toggleDropdown(event) {
    let deleteBtn = event.target.nextElementSibling;
    if (deleteBtn.style.display == "none")
      deleteBtn.style.display = 'block';
    else
      deleteBtn.style.display = 'none';
  }

  // Eliminar reporte
  deleteReport( consecutivo ) {
    this.idb.deleteReport(consecutivo).then(() => {
      this.getReportsFromAssignment();
    });    
  }

  // Crear reporte
  async crearReporte() {

    const {value: reportName} = await Swal.fire ({
      title: 'Nombre del nuevo reporte',
      input: 'text',
      inputValue: String(`Reporte ${this.numeroReportes + 1}`),
      showCancelButton: true,
      inputValidator: (value) => {
        if(!value)   {
          return 'Escribe algo !';
        }
      }
    })

    if (reportName !== undefined) {
      console.log(reportName)
      let report = this.idb.crearReporte(reportName, this.numeroReportes);
      this.idb.createReportIDB(report);
      this.getReportsFromAssignment();
      console.log('Reporte creado : ', report);
    }
  }
  
}
