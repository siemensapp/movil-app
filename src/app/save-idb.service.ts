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
  private reportFields = [ 'nombreCliente', 'nombreContacto', "nombreColaborador", "nombreProyecto", 'nombreMarca', 'denominacionInterna', 'numeroProducto', 'numeroSerial', 'caracteristicasTecnicas', 'estadoInicial', 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes' ];

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

  createReport() {
    var report = { Consecutivo: this.nuevoConsecutivo() };
    for ( let i of this.reportFields ) report[i] = localStorage.getItem(i);
    report['hours'] = this.componentsComms.getHours();
    console.log(report);
    return report;
  }

  createOrSaveReport() {
    if( localStorage.getItem(this.nuevoConsecutivo()) !== null) {
      console.log('Existent key: retrieving it ...')
      let report = this.createReport();
      console.log('Done updating')
      localStorage.setItem( this.nuevoConsecutivo(), JSON.stringify(report));
      this.saveReport(report);
      console.log('localStorage: ', localStorage.getItem(this.nuevoConsecutivo()));
      console.log('IndexedDB: ', this.getReport(this.nuevoConsecutivo()));
    } else {
      console.log('Key non-existen : Creating one ...')
      localStorage.setItem(this.nuevoConsecutivo(), JSON.stringify({}));
      console.log('localStorage: ', localStorage.getItem(this.nuevoConsecutivo()));
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

  deleteReport( consecutivo ) {
    this.mobileDB.reports.delete(consecutivo)
      .then(() => {
        Swal.fire('Reporte eliminado', 'de la memoria local', 'success');
      })
  }

  getReport( consecutivo ) {
    return this.mobileDB.reports.where({Consecutivo: consecutivo}).toArray();
  }

  getAllReports() {
    return this.mobileDB.reports.toArray();
  }

}
