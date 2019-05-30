import { Injectable } from '@angular/core';
import { OnlineStatusService } from './online-status.service';
import Dexie from 'dexie';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SaveIDBService {

  private mobileDB;

  constructor(private isOnline: OnlineStatusService) {
    this.createDatabase();
  }

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
