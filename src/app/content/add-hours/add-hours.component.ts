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

  ngOnInit() {
    this.componentComms.setBackStatus(true);
  }

  saveHours() {
    let fecha = (<HTMLInputElement>document.getElementById("fecha")).value;
    let desde = (<HTMLInputElement>document.getElementById("desde")).value;
    let hasta = (<HTMLInputElement>document.getElementById("hasta")).value;
    let descuento = (<HTMLInputElement>document.getElementById("descuento")).value;
    let servicioSitio = (<HTMLInputElement>document.getElementById("servicioSitio")).value;
    let entrenamiento = (<HTMLInputElement>document.getElementById("entrenamiento")).value;
    let tiempoViaje = (<HTMLInputElement>document.getElementById("tiempoViaje")).value;
    let tiempoEspera = (<HTMLInputElement>document.getElementById("tiempoEspera")).value;

    let hours = (localStorage.getItem('hours')) ? JSON.parse(localStorage.getItem('hours')) : {hours: []};

    let record = {
      fecha: fecha,
      desde: desde,
      hasta: hasta,
      descuento: descuento,
      servicioSitio: servicioSitio,
      entrenamiento: entrenamiento,
      tiempoViaje: tiempoViaje,
      tiempoEspera: tiempoEspera
    }
    hours['hours'].push(record);
    this.componentComms.setHours(hours);
    Swal.fire({type: "success", title: "Exito", text: 'Hora guardada'})
          .then(() => { this.router.navigate(['home/report']) });
    
  }


}
