
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { HttpRequestsService } from 'src/app/http-requests.service';
import { url } from '../../../assets/js/variables';
import Swal from 'sweetalert2'; 
import { Router } from '@angular/router';
import { SaveIDBService } from '../../save-idb.service';
import { map } from 'rxjs-compat/operator/map';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit, OnDestroy {
  // Subscripcion a boton derecho de navbar
  private RightBtnSubscription: Subscription;


  data = null;

  // Set our map properties
  mapCenter = [-74.183888, 4.777068];
  basemapType = 'streets-navigation-vector';
  mapZoomLevel = 14;
  siteMarker = [-74.183888, 4.777068];

  // Status asignacion
  statusAsignacion;

  mapOpen;
  mapOpenedBefore = false;

  constructor(private componentsComms: ComponentsCommsService, private httpRequests: HttpRequestsService, private router: Router, private saveIDB: SaveIDBService) { }

  ngOnDestroy() {
    this.componentsComms.setDetailsMapStatus(false);
    this.RightBtnSubscription.unsubscribe();
  }

  ngOnInit() {    
    // Suscribir a boton derecho de navbar
    this.RightBtnSubscription = this.componentsComms.rightNavBtn.subscribe(mapOpen => {
      this.mapOpen = mapOpen;
      this.showMap(this.mapOpen);
      console.log('is map open :', this.mapOpen);
    });

    this.componentsComms.getCurrentCords(false + '');
    
    // Carga los detalles de la asignacion 
    this.data = this.componentsComms.getDataAssignment();
    console.log('Data assignment: ', this.data);
    // VALIDACION - Se necesita el status de la asignacion para habilitar boton     
    this.mapCenter = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.siteMarker = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.componentsComms.setBackStatus(true);
  }

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  parseDate(date1, date2) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    let sameYearDates = String(meses[dateOne.getMonth()] + ' ' + (dateOne.getDate()+1) + ' - ' + meses[dateTwo.getMonth()] + ' ' + (dateTwo.getDate()+1));
    let diffYearDates = String(meses[dateOne.getMonth()] + ' ' + (dateOne.getDate()+1) + ' ' + dateOne.getFullYear() + ' - ' + meses[dateTwo.getMonth()] + ' ' + (dateTwo.getDate()+1) + ' ' + dateTwo.getFullYear());
    return ( dateOne.getFullYear() == dateTwo.getFullYear() ) ? sameYearDates: diffYearDates; 
  }


  translatePCFSV( PCFSV ) {
    switch (PCFSV) {
      case 'P':
        return 'Preventivo planeado';
      case 'C':
        return 'Correctivo planeado';
      case 'F':
        return 'Pruebas FAT';
      case 'S':
        return 'Puesta en servicio';
      case 'V':
        return 'Soporte ventas';
      case 'O':
        return 'OTRO';
    }
  }

  writeReport(){
    document.getElementById("reportsMenu").classList.toggle("show");
  } 

  aceptarServicio(){
    /**
     * Cambia el estado de la asignacion localmente y envia los datos al back
     * Habilita el boton para editar el reporte
     */
    this.data['StatusAsignacion'] = 1;
    this.componentsComms.setDataAssignment(this.data);
    var datos = {
      'tiempoInicio' : '',
      'tiempoFin' : '',
      'IdAsignacion' : this.data['IdAsignacion'],
      'StatusAsignacion' : 1
    }
    this.httpRequests.postData(url + '/api/updateTimeStamps', JSON.stringify(datos)).then((res) => {
        if(res !== "Error en la base de datos"){

          Swal.fire('Servicio aceptado', '', 'success');
        }
        else{
          Swal.fire( 'ERROR','No se pudo aceptar la asignación', 'error');
        }
    });
  }

  showMap( show ) {
    let mapContainer = <HTMLElement>document.getElementById('map-container');
    if ( show ) {      
      mapContainer.style.transform = "translatex(100vw)";
    } else {
      mapContainer.style.transform = "translatex(-100vw)";
    }

  }

  empezarAsignacion(){
    this.componentsComms.getCurrentCords(true+'-'+this.data['IdAsignacion']);
    var timeStampHoy = new Date();
    let date = timeStampHoy.getDate();
    let month = timeStampHoy.getMonth() + 1;
    let year = timeStampHoy.getFullYear();
    
    let realDate = (date < 10 ) ? String('0' + date) : String (date);
    let realMonth = (month < 10) ? String( '0' + month ) : String(month);
    let realTime = String(timeStampHoy.getHours()) + ':' + String(timeStampHoy.getMinutes()) + ':' + String(timeStampHoy.getSeconds());

    let timeStampInicio = String(year) + '-' + realMonth + '-' + realDate + " " + realTime;
    
    this.data['StatusAsignacion'] = 2;
    this.componentsComms.setDataAssignment(this.data);
    var datos = {
        'tiempoInicio' : timeStampInicio,
        'tiempoFin' : '',
        'IdAsignacion' : this.data['IdAsignacion'],
        'StatusAsignacion' : 2
    }
    this.httpRequests.postData(url + '/api/updateTimeStamps', JSON.stringify(datos)).then((res) => {
        if(res !== "Error en la base de datos"){
          Swal.fire('Asignacion Empezada', timeStampInicio, 'success')
        }
        else{
          Swal.fire('ERROR', 'No se pudo empezar la asignación','error');
        }
    });
  } 

  terminarAsignacion(){
    this.componentsComms.getCurrentCords(true+'-'+ this.data['IdAsignacion']);
    var timeStampHoy = new Date().toLocaleString();
    var fechaHoy;
    if(parseInt(timeStampHoy.split(" ")[0].split("/")[1])<10){
      fechaHoy = timeStampHoy.split(" ")[0].split("/")[2]+'-0'+timeStampHoy.split(" ")[0].split("/")[1]+'-'+timeStampHoy.split(" ")[0].split("/")[0];
    }
    else{
      fechaHoy = timeStampHoy.split(" ")[0].split("/")[2]+'-'+timeStampHoy.split(" ")[0].split("/")[1]+'-'+timeStampHoy.split(" ")[0].split("/")[0];
    }
    var horaHoy = new Date().toLocaleTimeString();
    var timeStampFinal = fechaHoy+' '+horaHoy;

    this.data['StatusAsignacion'] = 3;
    this.componentsComms.setDataAssignment(this.data);
    var datos = {
      'tiempoInicio' : '',
      'tiempoFin' : timeStampFinal,
      'IdAsignacion' : this.data['IdAsignacion'],
      'StatusAsignacion' : 3
  }
  this.httpRequests.postData(url + '/api/updateTimeStamps', JSON.stringify(datos)).then((res) => {
    if(res !== "Error en la base de datos"){
      Swal.fire('Asignacion Terminada', timeStampFinal, 'success');
    }
    else{
      Swal.fire('ERROR','No se pudo terminar la asignación','error');
    }
    });
  }

  rechazarServicio(){
    this.componentsComms.getCurrentCords(true+'-'+ this.data['IdAsignacion']);
    var timeStampHoy = new Date().toLocaleString();
    var fechaHoy;
    if(parseInt(timeStampHoy.split(" ")[0].split("/")[1])<10){
      fechaHoy = timeStampHoy.split(" ")[0].split("/")[2]+'-0'+timeStampHoy.split(" ")[0].split("/")[1]+'-'+timeStampHoy.split(" ")[0].split("/")[0];
    }
    else{
      fechaHoy = timeStampHoy.split(" ")[0].split("/")[2]+'-'+timeStampHoy.split(" ")[0].split("/")[1]+'-'+timeStampHoy.split(" ")[0].split("/")[0];
    }
    var horaHoy = new Date().toLocaleTimeString();
    var timeStampFinal = fechaHoy+' '+horaHoy;

    this.data['StatusAsignacion'] = 4;
    this.componentsComms.setDataAssignment(this.data);
    var datos = {
      'tiempoInicio' : timeStampFinal,
      'tiempoFin' : timeStampFinal,
      'IdAsignacion' : this.data['IdAsignacion'],
      'StatusAsignacion' : 4
  }
  this.httpRequests.postData(url + '/api/updateTimeStamps', JSON.stringify(datos)).then((res) => {
    if(res !== "Error en la base de datos"){
      Swal.fire('Asignacion Rechazada', timeStampFinal, 'warning');
      this.router.navigate(['home/assignments-list']);
    }
    else{
      Swal.fire('ERROR','No se pudo rechazar la asignación','error');
    }
    });
  }

}
