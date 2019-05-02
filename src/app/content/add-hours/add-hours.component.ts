import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-hours',
  templateUrl: './add-hours.component.html',
  styleUrls: ['./add-hours.component.css']
})
export class AddHoursComponent implements OnInit {
  constructor(private componentComms: ComponentsCommsService, private router:Router) { }

  dateToChange = null;

  ngOnInit() {
    this.dateToChange = localStorage.getItem('dateToChange'); 
    console.log(this.dateToChange);
    this.componentComms.setBackStatus(true);
    this.addOrModifyHours();
  }

  formatDate( date ) {
    let auxDate = new Date(date);
    return String(auxDate.getMonth() + "/" + (auxDate.getDate() + 1) + "/" + auxDate.getFullYear());
  }

  addOrModifyHours() {
    if( this.dateToChange ) {
      var dateData = this.componentComms.getHours()[this.dateToChange];
      // (<HTMLInputElement>document.getElementById("fecha")).value = dateData['fecha'];      
      (<HTMLInputElement>document.getElementById("desde")).value = dateData['desde'];
      (<HTMLInputElement>document.getElementById("hasta")).value = dateData['hasta'];
      (<HTMLInputElement>document.getElementById("descuento")).value = dateData['descuento'];
      (<HTMLInputElement>document.getElementById("servicioSitio")).value = dateData['servicioSitio'];
      (<HTMLInputElement>document.getElementById("entrenamiento")).value = dateData['entrenamiento'];
      (<HTMLInputElement>document.getElementById("tiempoViaje")).value = dateData['tiempoViaje'];
      (<HTMLInputElement>document.getElementById("tiempoEspera")).value = dateData['tiempoEspera'];
    }
  }

  saveHours() {
    let fecha = (this.dateToChange) ? this.dateToChange : (<HTMLInputElement>document.getElementById("fecha")).value;
    let desde = (<HTMLInputElement>document.getElementById("desde")).value;
    let hasta = (<HTMLInputElement>document.getElementById("hasta")).value;
    let descuento = (<HTMLInputElement>document.getElementById("descuento")).value;
    let servicioSitio = (<HTMLInputElement>document.getElementById("servicioSitio")).value;
    let entrenamiento = (<HTMLInputElement>document.getElementById("entrenamiento")).value;
    let tiempoViaje = (<HTMLInputElement>document.getElementById("tiempoViaje")).value;
    let tiempoEspera = (<HTMLInputElement>document.getElementById("tiempoEspera")).value;

    let hours = JSON.parse(localStorage.getItem('hours'));

    hours[fecha] = {
      fecha: fecha,
      desde: desde,
      hasta: hasta,
      descuento: descuento,
      servicioSitio: servicioSitio,
      entrenamiento: entrenamiento,
      tiempoViaje: tiempoViaje,
      tiempoEspera: tiempoEspera
    }
    console.log(hours);

    localStorage.setItem('hours', JSON.stringify(hours));

    Swal.fire({type: "success", title: "Exito", text: 'Hora guardada'})
          .then(() => { 
            this.router.navigate(['home/report']);
            localStorage.removeItem('dateToChange');
          });
    
  }


}
