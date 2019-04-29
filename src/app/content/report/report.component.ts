import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { HttpRequestsService } from 'src/app/http-requests.service';
import {url} from '../../../assets/js/variables'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  private textAreas = [ 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes' ];
  //private textAreas = [ 'descripcionAlcance' ];
  hours = [];
  assignment;

  constructor(private componentComms: ComponentsCommsService, private httpRequest: HttpRequestsService) { }

  ngOnInit() {
    this.componentComms.setBackStatus(true);
    this.hours = this.componentComms.getHours()['hours'];
    this.resizeTextArea();
    this.assignment = this.componentComms.getDataAssignment()['IdAsignacion'];
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
      context.clearRect(0,0,900,250);
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
      canvas.style.visibility = 'hidden';
      canvas.style.height = '0px';
      document.getElementById(borrar).style.visibility = 'hidden';
            
    }
    else{
    canvas.style.visibility = 'visible';
    canvas.style.height = '250px';
    canvas.style.width = '900px';
    document.getElementById(borrar).style.visibility = 'visible';
            
    }
  }

  resizeTextArea() {
    for (let id of this.textAreas) {
      let item = document.getElementById(id);
      item.addEventListener('keydown', () => {
        if (item.scrollTop != 0) {
          item.style.height = item.scrollHeight + "px";
        };
      })
    }
  }

  crearReporte(){
    var nombreCliente = <HTMLInputElement> document.getElementsByName('nombreCliente')[0];
    var NombreCliente = nombreCliente.value;

    var nombreContacto = <HTMLInputElement> document.getElementsByName('nombreContacto')[0];
    var NombreContacto = nombreContacto.value;

    
    var nombreColaborador = <HTMLInputElement> document.getElementsByName('nombreColaborador')[0];
    var NombreColaborador = nombreColaborador.value;

    var nombreProyecto = <HTMLInputElement> document.getElementsByName('nombreProyecto')[0];
    var NombreProyecto = nombreProyecto.value;
  
    var descripcionAlcance = <HTMLTextAreaElement> document.getElementById('descripcionAlcance');
    var DescripcionAlcance = descripcionAlcance.value;

    var hojaTiempo = this.hours;

    var marca = <HTMLInputElement> document.getElementsByName('nombreMarca')[0];
    var Marca = marca.value;

    var denominacionInterna = <HTMLInputElement> document.getElementsByName('denominacionInterna')[0];
    var DenominacionInterna = denominacionInterna.value;

    var numeroProducto = <HTMLInputElement> document.getElementsByName('numeroProducto')[0];
    var NumeroProducto = numeroProducto.value;

    var numeroSerial = <HTMLInputElement> document.getElementsByName('numeroSerial')[0];
    var NumeroSerial = numeroSerial.value;

    var caracteristicasTecnicas = <HTMLInputElement> document.getElementsByName('caracteristicasTecnicas')[0];
    var CaracteristicasTecnicas = caracteristicasTecnicas.value;

    var estadoInicial = <HTMLInputElement> document.getElementsByName('estadoInicial')[0];
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



    var datos = {
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
        'IdAsignacion' : this.assignment
    }

    this.httpRequest.postData(url + '/api/saveGeneralReport', JSON.stringify(datos));
  }


}