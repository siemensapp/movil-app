import { Injectable } from '@angular/core';
import { ComponentsCommsService } from './components-comms.service';
import { OnlineStatusService } from './online-status.service';
import Dexie from 'dexie';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SaveIDBService {

  private mobileDB;
  private reportFields = [ 'NombreEmpresa', 'NombreContacto', "NombreE", "NombreProyecto", 'NombreMarca', 'DenominacionInterna', 'NumeroProducto', 'NumeroSerial', 'CaracteristicasTecnicas', 'EstadoInicial', 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes' ];

  constructor(private isOnline: OnlineStatusService, private componentsComms: ComponentsCommsService) {
    this.createDatabase();
  }

  /**
   * LocalStorage
   */
  nuevoConsecutivo() {
    /**
     * Consecutivo para guardar localmente antes de enviar
     * 
     * return IdEmpresa + IdTecnica + FechaInicio
     */
    let assignmentData = this.componentsComms.getDataAssignment();
    let fechaCompleta = assignmentData['FechaInicio'].split("T")[0];
    let idEmpresa = assignmentData['IdEmpresa'];
    let tecnica = assignmentData['IdTecnica'];

    let fechaAux = fechaCompleta.split("-");
    let fecha = String(fechaAux[0] + fechaAux[1] + fechaAux[2]);
    return String(idEmpresa + '-' + tecnica + '-' + fecha );
  }

  /**
   * Si viene de 'list'
   *    => Carga reporte de IDB, si no existe, lo crea
   *    => Monta reporte en LS
   * Si viene de 'report'
   *    => Guarda report en IDB
  */
  createOrSaveReport() {
    var lastURL = localStorage.getItem('lastURL');
    if(lastURL.includes("list")) {
      console.log("list")
      this.getReport(this.nuevoConsecutivo()).then(result => {
        if (result !== undefined) {
          // Guarda reporte actualizado en LS 
          localStorage.setItem(this.nuevoConsecutivo(), JSON.stringify(result)); 
          console.log("Reporte existe - cargando a LS")
  
        } else {  
          console.log("report")
          // Se crea nuevo reporte        
          var report = { Consecutivo: this.nuevoConsecutivo(), hours: {}};
          for( let x of this.reportFields) report[x] = "";
  
          // Local Storage
          localStorage.setItem(this.nuevoConsecutivo(), JSON.stringify(report));
  
          // Indexed DB
          this.saveReportHidden(report);
          console.log('Reporte creado en IDB y LS: ', report);
        }
      })
    } else if (lastURL.includes("report")) {
      var report = JSON.parse(localStorage.getItem(this.nuevoConsecutivo()));
      for( let x of this.reportFields) report[x] = localStorage.getItem(x);
      console.log('report coming from report :', report);
      this.saveReportHidden(report);
    }
  }


  /**
   * Indexed DB
   */
  createDatabase() {
    this.mobileDB = new Dexie('mobileDB');
    this.mobileDB.version(1).stores({
      reports: '&Consecutivo'
    });
  }

  saveReport( report ) {
    Swal.showLoading()
    this.mobileDB.reports.put(report)
      .then(() => {
        Swal.fire('Sin Internet', 'El reporte se guardo localmente, sera enviado cuando haya una conexión a Internet', 'warning');
      })
  }

  saveReportHidden( report ) {
    this.mobileDB.reports.put(report)
      .then(() => {
        console.log('saved report');
      })
  }

  deleteReport( consecutivo ) {
    this.mobileDB.reports.delete(consecutivo)
      .then(() => {
        Swal.fire('Reporte eliminado', 'de la memoria local', 'success');
      })
  }

  getReport( consecutivo ) {
    // return this.mobileDB.reports.where({Consecutivo: consecutivo}).toArray();
    return this.mobileDB.reports.get(consecutivo);
  }

  getAllReports() {
    return this.mobileDB.reports.toArray();
  }

}
