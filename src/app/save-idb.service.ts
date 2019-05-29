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

  checkConnection() {
    // this.isOnline.connectionChanged.subscribe(online => {
    //   (online)? Swal.fire('Con Internet', 'Enviado', 'success'): Swal.fire('Sin Internet', 'Guardado en IndexedDB', 'warning');
    // })
    console.log(this.isOnline.isOnline);
  }

  createDatabase() {
    this.mobileDB = new Dexie('mobileDB');
    this.mobileDB.version(1).stores({
      reports: '&Consecutivo'
    });
  }

  saveReport( report ) {
    this.mobileDB.reports.put(report)
      .then(() => {
        Swal.fire('Reporte añadido', 'Guardado en IndexedDB', 'success');
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
    this.checkConnection();
    return this.mobileDB.reports.toArray();
  }



//   testDB() {
//     this.mobileDB.reports.add({Consecutivo: 'Carlos Slim', data: {name: 'Solo', lastname: 'probando'}})
//       .then(() => {
//         console.log('adding item to IDB ...');
//         return this.mobileDB.reports.toArray();
//       }).then( results => {
//         console.log('Got results :', results);
//       }).catch((e) => {
//         alert('Error: ' + (e.stack || e));
//       })
//   }
}
