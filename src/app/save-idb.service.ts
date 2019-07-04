import { Injectable } from '@angular/core';
import { ComponentsCommsService } from './components-comms.service';
import Dexie from 'dexie';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SaveIDBService {

  private mobileDB;
  private reportFields = [ 'NombreEmpresa', 'NombreContacto', "NombreE", "NombreProyecto", 'NombreMarca', 'DenominacionInterna', 'NumeroProducto', 'NumeroSerial', 'CaracteristicasTecnicas', 'EstadoInicial', 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes', 'campoEmisor', 'campoCliente' ];
  private firmasFields = ['campoEmisor', 'campoCliente'];

  constructor(private componentsComms: ComponentsCommsService) {
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

  newConsecutivo( assignment ) {
    /**
     * Consecutivo para guardar localmente antes de enviar
     * 
     * return IdEmpresa + IdTecnica + FechaInicio
     */
    let assignmentData = assignment;
    let fechaCompleta = assignmentData['FechaInicio'].split("T")[0];
    let idEmpresa = assignmentData['IdEmpresa'];
    let tecnica = assignmentData['IdTecnica'];

    let fechaAux = fechaCompleta.split("-");
    let fecha = String(fechaAux[0] + fechaAux[1] + fechaAux[2]);
    return String(idEmpresa + '-' + tecnica + '-' + fecha );
  }
  
  createOrSaveReport() {
    /**
     * Si viene de 'list'
     *    => Carga reporte de IDB, si no existe, lo crea
     *    => Monta reporte en LS
     * Si viene de 'report'
     *    => Revisa campo firmas a ver si existen
     *    Si existen
     *      => los toma del reporte
     *      => Si no, los crea ""
     *    => Guarda report en IDB     
    */
    var lastURL = localStorage.getItem('lastURL');
    if(lastURL.includes("list")) {
      console.log("list")
      this.getReport(this.nuevoConsecutivo()).then(result => {
        if (result !== undefined) {

          // Guarda reporte actualizado en LS 
          localStorage.setItem(this.nuevoConsecutivo(), JSON.stringify(result)); 
          console.log("Reporte existe - cargando a LS: ", result)
          
          // Carga de firmas a LS
          console.log('Carga de firmas a LS')
          for(let x of this.firmasFields) localStorage.setItem(x, result[x]);

        } else {  

          // Se crea nuevo reporte        
          var report = { Consecutivo: this.nuevoConsecutivo(), hours: {}};
          for( let x of this.reportFields) report[x] = "";
  
          // Local Storage
          localStorage.setItem(this.nuevoConsecutivo(), JSON.stringify(report));
  
          // Indexed DB
          this.saveReportHidden(report);
          console.log('Reporte creado en IDB y LS: ', report);

          // Carga de firmas a LS
          console.log('Carga de firmas a LS')
          for(let x of this.firmasFields) localStorage.setItem(x, report[x]);
        }
      })
    } else if (lastURL.includes("report")) {
      var report = JSON.parse(localStorage.getItem(this.nuevoConsecutivo()));

      // Actualiza el reporte con los nuevos cambios
      for( let x of this.reportFields) report[x] = localStorage.getItem(x);
      
      // Carga las horas actualizadas en el reporte
      report['hours'] = this.componentsComms.getHours();
      console.log('report coming from report :', report);

      // Lo carga en caso de entrar y volver a salir del reporte a los detalles
      localStorage.setItem(this.nuevoConsecutivo(), JSON.stringify(report));

      // Lo guarda en IDB
      this.saveReportHidden(report);
    }
  }


  /**
   * Indexed DB
   */
  
  // Creates 2 DB's : reports and assignments
  createDatabase() {
    console.log('Creating IDB database');
    this.mobileDB = new Dexie('mobileDB');
    this.mobileDB.version(1).stores({
      reports: '&Consecutivo',
      assignments: '&Consecutivo'
    });
  }

  // Save assignments in bulk when getting data for assigments-list
  saveAssignmentsLocally( list ) {
    var records = [];
    for( let assignment of list ) {
      assignment['Consecutivo'] = this.newConsecutivo(assignment);
      records.push(assignment);
    }
    console.log('Before saving assignments locally ...', records)
    this.mobileDB.assignments.bulkPut(records).then(() => {
      console.log('saveAssignmentsLocally: Asignaciones guardadas exitosamente');
    }).catch(Dexie.BulkError, (e) => {
      console.log('saveAssignmentsLocally: No todas se guardaron, solo ' + list.length + ' lo lograron.');
    })
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

  getAllReports( consecutivo ) {
    return this.mobileDB.reports.where('Consecutivo').startsWith(consecutivo).toArray();
  }

  getAllAssignments() {
    return this.mobileDB.assignments.toArray();
  }

}
