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

  assignmentDates = [];

  ngOnInit() {
    this.aparicionBoton();
    this.dateToChange = localStorage.getItem('dateToChange');
    /**
     * Esta parte se hace para acomodar la fecha del input en caso de que tenga, siempre le resta uno a la fecha
     */
    let dateForInputAux = new Date(this.dateToChange);
    dateForInputAux.setDate(dateForInputAux.getDate() + 1); 
    this.dateForInput = dateForInputAux.toISOString().split("T")[0];

    // Obtener fechas de asignacion
    this.assignmentDates.push(this.componentComms.getDataAssignment()['FechaInicio'])
    this.assignmentDates.push(this.componentComms.getDataAssignment()['FechaFin'])

    // Flujo normal
    this.componentComms.setBackStatus(true);
    this.addOrModifyHours();
  }

  formatDate( date ) {
    console.log('Fecha sola:', date)
    let auxDate = new Date(date);
    // Para comparar solo las fechas sin preocuparse por la hora
    auxDate.setHours(0,0,0,0);
    console.log('Fecha antes del formateo :', auxDate)
    console.log('Fecha transformada', String(auxDate.getFullYear() + "-" + ( (auxDate.getMonth() + 1 < 10)? "0" + (auxDate.getMonth() + 1) : (auxDate.getMonth() + 1) ) + "-" + ( (auxDate.getDate() < 10)? "0" + auxDate.getDate(): auxDate.getDate() )));
    return String(auxDate.getFullYear() + "-" + ( (auxDate.getMonth() + 1 < 10)? "0" + (auxDate.getMonth() + 1) : (auxDate.getMonth() + 1) ) + "-" + ( (auxDate.getDate() < 10)? "0" + auxDate.getDate() : auxDate.getDate()));
  }

  aparicionBoton(){
    var originalSize = window.innerWidth + window.innerHeight;
    var saveButton = document.getElementById("saveBtn");
    window.addEventListener("resize", () => {
      (window.innerHeight + window.innerWidth !== originalSize) ? saveButton.style.display = "none" : saveButton.style.display = "flex";
    })
  }

  returnTimeFromString( time ) {
    let aux = new Date();
    aux.setHours(parseInt(time.split(':')[0]));
    aux.setMinutes(parseInt(time.split(':')[1]));
    return aux;
  }

  diferenciaEntreTiempos( tiempo1, tiempo2) {
    // Diferencia entre Desde y Hasta
    let auxDiffDesde = this.returnTimeFromString(tiempo1);
    let auxDiffHasta = this.returnTimeFromString(tiempo2);

    let diff = Math.abs(auxDiffHasta.getTime() - auxDiffDesde.getTime());
    let hh = Math.floor(diff / 1000 / 60 / 60);
    diff -= hh * 1000 * 60 * 60;
    let mm = Math.floor( diff / 1000 / 60);

    let diffString = String( (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) );
    return diffString;
  }

  sumaDeTiempos( descuento, servicioSitio, entrenamiento, tiempoViaje, tiempoEspera ) {
    let auxTimes = [];
    auxTimes.push(this.returnTimeFromString(descuento));
    auxTimes.push(this.returnTimeFromString(servicioSitio));
    auxTimes.push(this.returnTimeFromString(entrenamiento));
    auxTimes.push(this.returnTimeFromString(tiempoViaje));
    auxTimes.push(this.returnTimeFromString(tiempoEspera));

    var totalH = 0;
    var totalM = 0;
    for(let time of auxTimes) {
      totalH += parseInt(time.getHours());
      totalM += parseInt(time.getMinutes());
    }

    if (totalM > 60) {
      totalH += Math.floor(totalM / 60);
      totalM = totalM % 60;
    }
    return String( (totalH < 10 ? '0' + totalH : totalH) + ':' + (totalM < 10 ? '0' + totalM : totalM) );
  }

  addOrModifyHours() {
    if( this.dateToChange ) {
      var dateData = this.componentComms.getHours()[this.dateToChange];    
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
    // let fecha = (this.dateToChange !== null) ? this.dateToChange : this.formatDate((<HTMLInputElement>document.getElementById("fecha")).value);
    let fecha = this.formatDate((<HTMLInputElement>document.getElementById("fecha")).value);
    let desde = ( (<HTMLInputElement>document.getElementById("desde")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("desde")).value;
    let hasta = ( (<HTMLInputElement>document.getElementById("hasta")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("hasta")).value;
    let descuento = ( (<HTMLInputElement>document.getElementById("descuento")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("descuento")).value;
    let servicioSitio = ( (<HTMLInputElement>document.getElementById("servicioSitio")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("servicioSitio")).value;
    let entrenamiento = ( (<HTMLInputElement>document.getElementById("entrenamiento")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("entrenamiento")).value;
    let tiempoViaje = ( (<HTMLInputElement>document.getElementById("tiempoViaje")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("tiempoViaje")).value;
    let tiempoEspera = ( (<HTMLInputElement>document.getElementById("tiempoEspera")).value == "")? "00:00" : (<HTMLInputElement>document.getElementById("tiempoEspera")).value;

    // Para validaciones
    let fechaMadeDate = new Date(fecha);
    fechaMadeDate.setDate(fechaMadeDate.getDate() + 1);
    // Para comparar solo las fechas sin preocuparse por la hora
    fechaMadeDate.setHours(0,0,0,0);

    /**
     *  VALIDACIONES
     * 
     *  Para ser guardado debe:
     *  => Haber una fecha
     *  => La fecha elegida no esta en el rango de las fechas de la asignacion
     *  => Desde y Hasta no pueden ser 00:00 a la vez
     *  => Desde < Hasta
     *  => Descuento < Desde - Hasta
     */

    // Hay fecha ?
    if (fecha === 'NaN-NaN-NaN') {
      Swal.fire({
        type: 'warning',
        title: 'Debes ingresar una fecha !',
        text: "Toca en 'Selecciona una fecha'"
      })
    }
    // La fecha esta en el rango de las fechas de asignacion?
    else if ( (fechaMadeDate < new Date(this.assignmentDates[0])) || (fechaMadeDate > new Date(this.assignmentDates[1]))) {
      Swal.fire({
        type: 'warning',
        title: 'Fecha no esta en el rango !',
        html: "La fecha elegida no esta en el rango de las fechas de la asignación.<br><strong>Fecha Inicio: </strong>" + String(new Date(this.assignmentDates[0]).toISOString().split('T')[0]) + "<br><strong>Fecha Fin: </strong>" + String(new Date(this.assignmentDates[1]).toISOString().split('T')[0])
      })
    }
    // Ambos valores desde y hasta no pueden ser 00:00
    else if (desde == '00:00' && hasta == '00:00') {
      Swal.fire({
        type: 'warning',
        title: "Ambos valores 'Desde' y 'Hasta' no pueden ser '00:00'",
        text: "Selecciona valores validos"
      })
    }
    // Desde < Hasta 
    else if ( desde > hasta) {
      Swal.fire({
        type: 'warning',
        title: 'Rango de horas invalido',
        text: "El tiempo 'desde' debe ser menor que el tiempo 'hasta'"
      })
    }
    // Descuento < Hasta - Desde
    else if ( descuento > this.diferenciaEntreTiempos(desde, hasta) ) {
      Swal.fire({
        type: 'warning',
        title: 'Descuento invalido',
        text: "El tiempo 'descuento' debe ser menor que el tiempo entre 'hasta' y 'desde'"
      })
    } 
    // La suma de las horas de viaje, descuento, entrenamiento, etc.
    // Deben ser menores o iguales a Desde - Hasta
    else if ( this.diferenciaEntreTiempos(desde, hasta) < this.sumaDeTiempos(descuento, servicioSitio, entrenamiento, tiempoViaje, tiempoEspera) ){
      Swal.fire({
        type: 'warning',
        title: 'Error de horas',
        text: "La suma de las horas no concuerda con el tiempo entre 'Desde' y 'Hasta'."
      })
    }

    else {
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

}
