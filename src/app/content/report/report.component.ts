import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { HttpRequestsService } from 'src/app/http-requests.service';
import { OnlineStatusService } from '../../online-status.service';
import { SaveIDBService } from '../../save-idb.service';
import { Router } from '@angular/router';
import  Swal  from 'sweetalert2';
import {url} from '../../../assets/js/variables';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private allInputs = [ 'nombreCliente', 'nombreContacto', "nombreColaborador", "nombreProyecto", 'nombreMarca', 'denominacionInterna', 'numeroProducto', 'numeroSerial', 'caracteristicasTecnicas', 'estadoInicial'];
  private textAreas = [ 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes' ];
  hours;
  assignment;
  assignmentData;
  reportData;

  constructor(private componentComms: ComponentsCommsService, private httpRequest: HttpRequestsService, private router: Router, private idb: SaveIDBService, private isOnline: OnlineStatusService) { }

  ngOnInit() {
    this.assignmentData = this.componentComms.getDataAssignment();
    this.reportData = (localStorage.getItem(this.nuevoConsecutivo()) !== null)? JSON.parse(localStorage.getItem(this.nuevoConsecutivo())) : this.idb.getReport( this.nuevoConsecutivo() );
    // this.idb.getReport( this.nuevoConsecutivo() ).then((data) => {
    //   this.reportData = data[0];
    //   console.log('Report', this.reportData);
    //   this.hours = (this.reportData.hasOwnProperty('hours'))? this.reportData['hours'] : {};
    //   this.resizeAndSetTextArea();
    //   this.saveAndSetInputValues();
    // });
    
    //localStorage.removeItem('hours');    
    console.log(this.assignmentData);
    this.componentComms.setBackStatus(true);
    localStorage.removeItem('dateToChange');
    this.hours = (this.reportData.hasOwnProperty('hours'))? this.reportData['hours'] : {};
    console.log(this.hours);
    this.resizeAndSetTextArea();
    this.saveAndSetInputValues();
    this.assignment = this.assignmentData['IdAsignacion'];
  }

  getNameE() {
    return this.componentComms.getNameE();
  }

  addHours( date ) {
    localStorage.setItem('dateToChange', date);
    this.router.navigate(['home/hours']);
  }


  mostrar(campo: string, borrar:string){
    var canvas = <HTMLCanvasElement> document.getElementById(campo);
    var context = canvas.getContext('2d'); 
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;

    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y-40);
      clickDrag.push(dragging);
    }

    function redraw(){
        
      context.strokeStyle = "black";
      context.lineJoin = "round";
      context.lineWidth = 2;
          
      for(var i=0; i < clickX.length; i++) {		
        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.stroke();
      }
    }

    canvas.addEventListener('touchstart', function(e){
      var mouseX = e.changedTouches[0].pageX - this.offsetLeft;
      var mouseY = e.changedTouches[0].pageY - this.offsetTop;
        
      paint = true;
      addClick(mouseX, mouseY, false);
      redraw();
    });

    document.getElementById(borrar).addEventListener('mousedown', function(e){
      context.clearRect(0,0,500,250);
      clickX = [];
      clickY = [];
      clickDrag = [];
    });

    canvas.addEventListener('touchmove', function(e){
      if(paint){
        addClick(e.changedTouches[0].pageX - this.offsetLeft, e.changedTouches[0].pageY - this.offsetTop, true);
        redraw();
      }
    });

    canvas.addEventListener('touchend', function(e){
      paint = false;
    });

    canvas.addEventListener('touchleave', function(e){
      paint = false;
    });

    if(canvas.style.visibility == 'visible'){
      canvas.style.transition = "height 1s";      
      canvas.style.height = '0px';
      let sign = document.getElementById(borrar);      
      sign.style.visibility = 'hidden';
      setTimeout(() => {
        sign.previousElementSibling.querySelector('.fas').classList.remove('fa-minus');
        sign.previousElementSibling.querySelector('.fas').classList.add('fa-plus');
        canvas.style.visibility = 'hidden';
      }, 1000);
            
    }
    else{
      canvas.style.transition = "height 1s";
      canvas.style.visibility = 'visible';
      canvas.style.height = '250px';
      canvas.style.width = '500px';
      canvas.style.margin = "auto";
      let sign = document.getElementById(borrar);
      sign.style.visibility = 'visible';
      sign.previousElementSibling.querySelector('.fas').classList.remove('fa-plus');
      sign.previousElementSibling.querySelector('.fas').classList.add('fa-minus');
    }
  }

  resizeAndSetTextArea() {
    for (let id of this.textAreas) {
      let item = <HTMLTextAreaElement>document.getElementById(id);

      if ( this.reportData.hasOwnProperty(id) ) {
        item.value = this.reportData[id];
      }

      item.addEventListener('blur', () => {
        localStorage.setItem(id, String(item.value));
      });
      for (let event of ['keydown', 'change', 'paste', 'cut', 'drop', 'onkeydown', 'onchange', 'onpaste', 'oncut', 'ondrop']) {
        item.addEventListener(event, () => { if(item.scrollTop != 0) item.style.height = item.scrollHeight + 10 +"px"; })
      }      
    }
  }

  saveAndSetInputValues() {
    for (let id of this.allInputs) {
      let item = <HTMLInputElement>document.getElementById(id);
      if ( this.reportData.hasOwnProperty(id) ) {
        item.value = this.reportData[id];
      }

      item.addEventListener('blur', () => {
        localStorage.setItem(id, String(item.value));
      })
    }
  }

  crearReporte(){
    var nombreCliente = <HTMLInputElement> document.getElementById('nombreCliente');
    var NombreCliente = nombreCliente.value;

    var nombreContacto = <HTMLInputElement> document.getElementById('nombreContacto');
    var NombreContacto = nombreContacto.value;

    
    var nombreColaborador = <HTMLInputElement> document.getElementById('nombreColaborador');
    var NombreColaborador = nombreColaborador.value;

    var nombreProyecto = <HTMLInputElement> document.getElementById('nombreProyecto');
    var NombreProyecto = nombreProyecto.value;
  
    var descripcionAlcance = <HTMLTextAreaElement> document.getElementById('descripcionAlcance');
    var DescripcionAlcance = descripcionAlcance.value;

    var hojaTiempo = this.hours;

    var marca = <HTMLInputElement> document.getElementById('nombreMarca');
    var Marca = marca.value;

    var denominacionInterna = <HTMLInputElement> document.getElementById('denominacionInterna');
    var DenominacionInterna = denominacionInterna.value;

    var numeroProducto = <HTMLInputElement> document.getElementById('numeroProducto');
    var NumeroProducto = numeroProducto.value;

    var numeroSerial = <HTMLInputElement> document.getElementById('numeroSerial');
    var NumeroSerial = numeroSerial.value;

    var caracteristicasTecnicas = <HTMLInputElement> document.getElementById('caracteristicasTecnicas');
    var CaracteristicasTecnicas = caracteristicasTecnicas.value;

    var estadoInicial = <HTMLInputElement> document.getElementById('estadoInicial');
    var EstadoInicial = estadoInicial.value;

    var actividadesRealizadas = <HTMLTextAreaElement> document.getElementById('actividadesRealizadas');
    var ActividadesRealizadas = actividadesRealizadas.value;

    var conclusionesRecomendaciones = <HTMLTextAreaElement> document.getElementById('conclusionesRecomendaciones');
    var ConclusionesRecomendaciones = conclusionesRecomendaciones.value;

    var repuestosSugeridos = <HTMLTextAreaElement> document.getElementById('repuestosSugeridos');
    var RepuestosSugeridos = repuestosSugeridos.value;

    var actividadesPendientes = <HTMLTextAreaElement> document.getElementById('actividadesPendientes');
    var ActividadesPendientes = actividadesPendientes.value;


    var campoE = <HTMLCanvasElement> document.getElementById('campoEmisor');
    var imagencampoE = campoE.toDataURL();

    var campoRO = <HTMLCanvasElement> document.getElementById('campoResponsableO');
    var imagencampoRO = campoRO.toDataURL();

    var campoCo = <HTMLCanvasElement> document.getElementById('campoComerciante');
    var imagencampoCo = campoCo.toDataURL();

    var campoRP = <HTMLCanvasElement> document.getElementById('campoResponsableP');
    var imagencampoRP = campoRP.toDataURL();

    var campoCli = <HTMLCanvasElement> document.getElementById('campoCliente');
    var imagencampoCli = campoCli.toDataURL();
    var timeStampCreacion = new Date();
    let date = timeStampCreacion.getDate();
    let month = timeStampCreacion.getMonth() + 1;
    let year = timeStampCreacion.getFullYear();
    let realDate = (date < 10 ) ? String('0' + date) : String (date);
    let realMonth = (month < 10) ? String( '0' + month ) : String(month);
    let FechaCreacion = String(year) + '-' + realMonth + '-' + realDate;

    var datos = {
        'Consecutivo': this.nuevoConsecutivo(),
        'NombreCliente' : NombreCliente,
        'NombreContacto' : NombreContacto,
        'NombreColaborador' : NombreColaborador,
        'NombreProyecto' : NombreProyecto,
        'DescripcionAlcance' : DescripcionAlcance,
        'HojaTiempo' : hojaTiempo,
        'Marca' : Marca,
        'DenominacionInterna' : DenominacionInterna,
        'NumeroProducto' : NumeroProducto,
        'NumeroSerial' : NumeroSerial,
        'CaracteristicasTecnicas' : CaracteristicasTecnicas,
        'EstadoInicial' : EstadoInicial,
        'ActividadesRealizadas' : ActividadesRealizadas,
        'ConclusionesRecomendaciones' : ConclusionesRecomendaciones,
        'RepuestosSugeridos' : RepuestosSugeridos,
        'ActividadesPendientes' : ActividadesPendientes,
        'FirmaEmisor' : imagencampoE,
        'FirmaResponsableO' : imagencampoRO,
        'FirmaComerciante' : imagencampoCo,
        'FirmaResponsableP' : imagencampoRP,
        'FirmaCliente' : imagencampoCli,
        'IdAsignacion' : this.assignment,
        'FechaEnvio' : FechaCreacion
    }
    return datos;
  }

  nuevoConsecutivo() {
    /**
     * Consecutivo para guardar localmente antes de enviar
     * 
     * return IdEmpresa + IdTecnica + FechaInicio
     */
    let fechaCompleta = this.assignmentData['FechaInicio'].split("T")[0];
    let idEmpresa = this.assignmentData['IdEmpresa'];
    let tecnica = this.assignmentData['IdTecnica'];

    let fechaAux = fechaCompleta.split("-");
    let fecha = String(fechaAux[0] + fechaAux[1] + fechaAux[2]);


    return String(idEmpresa + '-' + tecnica + '-' + fecha );
  }

  subirReporte() {
    this.isOnline.connectionExists().then( online => {
      let reporte = this.crearReporte();
      (online)? this.enviarReporte(reporte) : this.guardarReporte(reporte);
    })    
  }

  guardarReporte( reporte ){
    this.idb.saveReport(reporte);
    console.log('Reportes: \n', this.idb.getAllReports());
  }

  enviarReporte( reporte ) {
    console.log('Online :)');
    // Swal.showLoading();
    // this.httpRequest.postData(url + '/api/saveGeneralReport', JSON.stringify(reporte)). then( result => {
    //   if (result == "false") Swal.fire({type: "error", title: "Error", text: "Error en subir reporte"});
    //   else {
    //     // Saves user number
    //     Swal.fire({type: "success", title: "Exito", text: 'Reporte enviado'})
    //       .then(() => { this.router.navigate(['home/details']) });
    //   }
    // });
  }


}