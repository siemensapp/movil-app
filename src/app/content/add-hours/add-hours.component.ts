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
  dateForInput = null;

  ngOnInit() {
    this.aparicionBoton();
    this.dateToChange = localStorage.getItem('dateToChange');
    /**
     * Esta parte se hace para acomodar la fecha del input en caso de que tenga, siempre le resta uno a la fecha
     */
    let dateForInputAux = new Date(this.dateToChange);
    dateForInputAux.setDate(dateForInputAux.getDate() + 1); 
    this.dateForInput = dateForInputAux.toISOString().split("T")[0];

    // Flujo normal
    this.componentComms.setBackStatus(true);
    this.addOrModifyHours();
  }

  formatDate( date ) {
    let auxDate = new Date(date);
    return String(auxDate.getFullYear() + "-" + ( (auxDate.getMonth() + 1 < 10)? "0" + (auxDate.getMonth() + 1) : (auxDate.getMonth() + 1) ) + "-" + ( (auxDate.getDate() < 10)? "0" + auxDate.getDate(): auxDate.getDate() ));
  }

  aparicionBoton(){
    var originalSize = window.innerWidth + window.innerHeight;
    var saveButton = document.getElementById("saveBtn");
    window.addEventListener("resize", () => {
      (window.innerHeight + window.innerWidth !== originalSize) ? saveButton.style.display = "none" : saveButton.style.display = "flex";
    })
  }

  addOrModifyHours() {
    if( this.dateToChange ) {
      var dateData = this.componentComms.getHours()[this.dateToChange];    
      console.log('date data:', dateData);
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
    let fecha = (this.dateToChange !== null) ? this.dateToChange : this.formatDate((<HTMLInputElement>document.getElementById("fecha")).value);
    let desde = ( (<HTMLInputElement>document.getElementById("desde")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("desde")).value;
    let hasta = ( (<HTMLInputElement>document.getElementById("hasta")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("hasta")).value;
    let descuento = ( (<HTMLInputElement>document.getElementById("descuento")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("descuento")).value;
    let servicioSitio = ( (<HTMLInputElement>document.getElementById("servicioSitio")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("servicioSitio")).value;
    let entrenamiento = ( (<HTMLInputElement>document.getElementById("entrenamiento")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("entrenamiento")).value;
    let tiempoViaje = ( (<HTMLInputElement>document.getElementById("tiempoViaje")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("tiempoViaje")).value;
    let tiempoEspera = ( (<HTMLInputElement>document.getElementById("tiempoEspera")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("tiempoEspera")).value;

    let hours = this.componentComms.getHours();
    console.log("hours 1:", hours);
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
    
    this.componentComms.setHours(hours);
    console.log("hours 2:", hours);
    Swal.fire({type: "success", title: "Exito", text: 'Hora guardada'})
          .then(() => { 
            this.router.navigate(['home/report']);
            localStorage.removeItem('dateToChange');
          });
    
  }


}
