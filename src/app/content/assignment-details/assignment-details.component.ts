
import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { Router } from '@angular/router';
import { HttpRequestsService } from 'src/app/http-requests.service';
import { url } from '../../../assets/js/variables';


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

  // Hour table
  hours = null;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);

  }

  parseDate(date1, date2) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateOne = new Date(date1);
    const dateTwo = new Date(date2);
    let sameYearDates = String(meses[dateOne.getMonth()] + ' ' + dateOne.getDate() + ' - ' + meses[dateTwo.getMonth()] + ' ' + dateTwo.getDate());
    let diffYearDates = String(meses[dateOne.getMonth()] + ' ' + dateOne.getDate() + ' ' + dateOne.getFullYear() + ' - ' + meses[dateTwo.getMonth()] + ' ' + dateTwo.getDate() + ' ' + dateTwo.getFullYear());
    return ( dateOne.getFullYear() == dateTwo.getFullYear() ) ? sameYearDates: diffYearDates; 
  }

  mostrarEstado(status: number){
    if(status==0){
      document.getElementById('startAssignment').style.visibility = 'visible';
      document.getElementById('startAssignment').style.height = '5vh';
    }
    else if(status == 1){
      document.getElementById('endAssignment').style.visibility = 'visible';
      document.getElementById('endAssignment').style.height = '5vh';
    }
    else{
      document.getElementById('finishedAssignment').style.visibility = 'visible';
    }
  }


  constructor(private componentsComms: ComponentsCommsService, private httpRequests: HttpRequestsService) { }

  ngOnInit() {
    this.data = this.componentsComms.getDataAssignment();
    console.log(this.data);
    this.mostrarEstado(this.data['StatusAsignacion']);
    this.mapCenter = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.siteMarker = [ parseFloat(this.data['CoordenadasSitio'].split(",")[0]), parseFloat(this.data['CoordenadasSitio'].split(",")[1]) ];
    this.componentsComms.setBackStatus(true);
    this.hours = this.componentsComms.getHours();

    this.componentsComms.coords.subscribe(coords => {
      console.log("Recibido", coords);
      var datos = {'Coords': coords,
                   'IdAsignacion': this.data['IdAsignacion']
                  }
      this.httpRequests.postData(url + '/api/updateCoords', JSON.stringify(datos));
    });

  }

  writeReport(){
    document.getElementById("reportsMenu").
    classList.toggle("show");
  } 

  empezarAsignacion(){
    var timeStampHoy = new Date();
    console.log(timeStampHoy);
    // if(parseInt(timeStampHoy.split(" ")[0].split("/")[0])<10){
    //   fechaHoy = (timeStampHoy.split(" ")[0].split("/")[2]).split(",")[0] + '-0' + timeStampHoy.split(" ")[0].split("/")[0] + '-' + timeStampHoy.split(" ")[0].split("/")[1];
    // }
    // else{
    //   fechaHoy = (timeStampHoy.split(" ")[0].split("/")[2]).split(",")[0] + '-' + timeStampHoy.split(" ")[0].split("/")[0] + '-' + timeStampHoy.split(" ")[0].split("/")[1];
    // }
    let date = timeStampHoy.getDate();
    let month = timeStampHoy.getMonth() + 1;
    let year = timeStampHoy.getFullYear();
    
    let realDate = (date < 10 ) ? String('0' + date) : String (date);
    let realMonth = (month < 10) ? String( '0' + month ) : String(month);
    let realTime = String(timeStampHoy.getHours()) + ':' + String(timeStampHoy.getMinutes()) + ':' + String(timeStampHoy.getSeconds());

    let timeStampInicio = String(year) + '-' + realMonth + '-' + realDate + " " + realTime;
    console.log(timeStampInicio);
    
    var datos = {
        'tiempoInicio' : timeStampInicio,
        'tiempoFin' : '',
        'IdAsignacion' : this.data['IdAsignacion'],
        'StatusAsignacion' : 1
    }
    this.httpRequests.postData(url + '/api/updateTimeStamps', JSON.stringify(datos));
    document.getElementById('startAssignment').style.visibility = 'hidden';
    document.getElementById('startAssignment').style.height = '0vh';
    document.getElementById('endAssignment').style.visibility = 'visible';
    document.getElementById('endAssignment').style.height = '5vh';
  } 

  terminarAsignacion(){
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
    console.log(timeStampFinal);
    var datos = {
      'tiempoInicio' : '',
      'tiempoFin' : timeStampFinal,
      'IdAsignacion' : this.data['IdAsignacion'],
      'StatusAsignacion' : 2
  }
  this.httpRequests.postData(url + '/api/updateTimeStamps', JSON.stringify(datos));
    document.getElementById('endAssignment').style.visibility = 'hidden';
    document.getElementById('endAssignment').style.height = '0vh';
    document.getElementById('finishedAssignment').style.visibility = 'visible';
  }

}
