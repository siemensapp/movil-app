
import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { HttpRequestsService } from 'src/app/http-requests.service';
import { url } from '../../../assets/js/variables';
import Swal from 'sweetalert2'; 
import { Router } from '@angular/router';
import { SaveIDBService } from '../../save-idb.service';


@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit {
  data = null;

  // Set our map properties
  mapCenter = [-74.183888, 4.777068];
  basemapType = 'streets-navigation-vector';
  mapZoomLevel = 14;
  siteMarker = [-74.183888, 4.777068];

  // Status asignacion
  statusAsignacion;

  // Hour table
  // hours = null;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  parseDate(date1, date2) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    let sameYearDates = String(meses[dateOne.getMonth()] + ' ' + (dateOne.getDate()+1) + ' - ' + meses[dateTwo.getMonth()] + ' ' + (dateTwo.getDate()+1));
    let diffYearDates = String(meses[dateOne.getMonth()] + ' ' + (dateOne.getDate()+1) + ' ' + dateOne.getFullYear() + ' - ' + meses[dateTwo.getMonth()] + ' ' + (dateTwo.getDate()+1) + ' ' + dateTwo.getFullYear());
    return ( dateOne.getFullYear() == dateTwo.getFullYear() ) ? sameYearDates: diffYearDates; 
  }

  constructor(private componentsComms: ComponentsCommsService, private httpRequests: HttpRequestsService, private router: Router, private saveIDB: SaveIDBService) { }

  ngOnInit() {
    this.componentsComms.getCurrentCords(false+'');
    this.saveIDB.createOrSaveReport();
    
    // Carga los detalles de la asignacion 
    this.data = this.componentsComms.getDataAssignment();
    console.log('Data assignment: ', this.data);
    // VALIDACION - Se necesita el status de la asignacion para habilitar boton 
    this.enableButton();
    
    this.mapCenter = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.siteMarker = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.componentsComms.setBackStatus(true);
    // this.hours = this.componentsComms.getHours();
    window.onclick = function(event) {
      if (!(<HTMLDivElement>event.target).matches('#plusBtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
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

          // Habilitación boton de creacion de reporte
          this.enableButton();
        }
        else{
          Swal.fire( 'ERROR','No se pudo aceptar la asignación', 'error');
        }
    });
  }

  enableButton() {
    var plusBtn = <HTMLElement>document.getElementById('plusBtn');
    if (this.data['StatusAsignacion'] == 1 || this.data['StatusAsignacion'] == 2) {      
      plusBtn.style.height = "60px";
      plusBtn.style.width = "60px";
      plusBtn.style.fontSize = "1.5rem";
    } else if (this.data['StatusAsignacion'] == 3) {
      plusBtn.style.height = "0";
      plusBtn.style.width = "0";
      plusBtn.style.fontSize = "0";
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
          this.enableButton();  
          // this.router.navigate(['home/list']);
        }
        else{
          Swal.fire(
            'ERROR',
            'No se pudo empezar la asignación',
            'error');
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
       this.enableButton();
        //this.router.navigate(['home/list']);
    }
    else{
      Swal.fire(
        'ERROR',
        'No se pudo terminar la asignación',
        'error');
    }
    });
  }

}
