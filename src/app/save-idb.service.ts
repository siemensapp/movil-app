import {
  Injectable
} from '@angular/core';
import {
  ComponentsCommsService
} from './components-comms.service';
import Dexie from 'dexie';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SaveIDBService {

  private mobileDB;
  private reportFields = ['NombreEmpresa', 'NombreContacto', "NombreE", "NombreProyecto", 'NombreMarca', 'DenominacionInterna', 'NumeroProducto', 'NumeroSerial', 'CaracteristicasTecnicas', 'EstadoInicial', 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes', 'campoEmisor', 'campoCliente'];
  private firmasFields = ['campoEmisor', 'campoCliente'];

  constructor(private componentsComms: ComponentsCommsService) {
    this.createDatabase();
  }

  /**
   * LocalStorage
   */

  // Crear consecutivo con asignacion actual
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
    return String(idEmpresa + '-' + tecnica + '-' + fecha);
  }

  // Crear consecutivo con datos de una asignacion
  newConsecutivo(assignment) {
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
    return String(idEmpresa + '-' + tecnica + '-' + fecha);
  }

  // Crear nuevo reporte con datos de asignación actual
  crearReporte(nombre, numeroReportes) {
    let assignment = this.componentsComms.getDataAssignment();

    // Llena el reporte
    let newReport = {
      Consecutivo: (numeroReportes > 0) ? String(this.nuevoConsecutivo() + "-" + (numeroReportes + 1)) : this.nuevoConsecutivo(),
      NombreReporte: nombre,
      NombreEmpresa: assignment['NombreEmpresa'],
      NombreE: this.componentsComms.getNameE(),
      NombreMarca: 'SIEMENS',
      descripcionAlcance: assignment['Descripcion'],
      NombreContacto: assignment['NombreContacto'],
      hours: {}
    };

    for (let field of this.reportFields) {
      if (!newReport.hasOwnProperty(field)) {
        newReport[field] = "";
      }
    }

    return newReport;
  }

  loadReportLS(report) {
    for (let field of Object.keys(report)) {
      localStorage.setItem(field, (field === 'hours')? JSON.stringify(report[field]) : report[field]);
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
  saveAssignmentsLocally(list) {
    var records = [];
    for (let assignment of list) {
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

  // Guardar reporte por primera vez en IDB
  createReportIDB(newReport) {
    this.mobileDB.reports.put(newReport).then(() => {
      Swal.fire('Reporte creado', 'Guardado localmente', 'success');
    })
  }

  saveReport(report) {
    Swal.showLoading()
    this.mobileDB.reports.put(report)
      .then(() => {
        Swal.fire('Sin Internet', 'El reporte se guardo localmente, sera enviado cuando haya una conexión a Internet', 'warning');
      })
  }

  saveReportHidden(report) {
    this.mobileDB.reports.put(report)
      .then(() => {
        console.log('Reporte actualizado!');
      })
  }

  deleteReport(consecutivo) {
    Swal.fire({
      title: 'Estas seguro?',
      text: `No podras recuperar el reporte ${consecutivo}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonColor: '#d33'
    }).then(result => {
        if (result.value) {
          //Swal.fire('Reporte eliminado', 'de la memoria local', 'success');
          this.mobileDB.reports.delete(consecutivo)
            .then(() => {
              Swal.fire('Reporte eliminado', 'de la memoria local', 'success');
            })
        }
    })
  }


  getReport(consecutivo) {
    // return this.mobileDB.reports.where({Consecutivo: consecutivo}).toArray();
    return this.mobileDB.reports.get(consecutivo);
  }

  getAllReports(consecutivo) {
    return this.mobileDB.reports.where('Consecutivo').startsWith(consecutivo).toArray();
  }

  getAllAssignments() {
    return this.mobileDB.assignments.toArray();
  }

}
