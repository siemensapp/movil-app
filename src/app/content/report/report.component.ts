import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ReportComponent implements OnInit, OnDestroy {
  private allInputs = [ 'NombreEmpresa', 'NombreContacto', "NombreE", "NombreProyecto", 'NombreMarca', 'DenominacionInterna', 'NumeroProducto', 'NumeroSerial', 'CaracteristicasTecnicas', 'EstadoInicial'];
  private textAreas = [ 'DescripcionAlcance', 'ActividadesRealizadas', 'ConclusionesRecomendaciones', 'RepuestosSugeridos', 'ActividadesPendientes' ];
  private firmCanvas = [ 'campoEmisor', 'campoCliente' ];
  private whiteCanvas = "data:image/png;base64,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";
  hours;
  assignment;
  assignmentData;
  reportData;
  imagenes;

  constructor(private componentComms: ComponentsCommsService, private httpRequest: HttpRequestsService, private router: Router, private idb: SaveIDBService, private isOnline: OnlineStatusService) { }

  ngOnDestroy() {
    var report = this.crearReporte("LS");
    console.log('Report on destroy:', report);
    if(window.location.href.includes('reports-list')) {
      this.idb.saveReportHidden(report);
      this.emptyLS();
    } else {
      for(let field of Object.keys(report)) localStorage.setItem(field, (field === 'hours')?JSON.stringify(report[field]): report[field])
      console.log('Changed report!');
    }
  }

  ngOnInit() {
    
    // // Elimina posibles firmas residuales, para solo trabajar con las del reporte
    // for(let x of this.firmCanvas)localStorage.removeItem(x);
    
    this.aparicionBoton();
    this.assignmentData = this.componentComms.getDataAssignment();
    this.componentComms.setBackStatus(true);
    localStorage.removeItem('dateToChange');

    // Se cargan las horas
    this.hours = this.componentComms.getHours();
    console.log('hours :', this.hours);

    this.resizeAndSetTextArea();
    this.saveAndSetInputValues();
    this.SetCanvas();
    this.assignment = this.assignmentData['IdAsignacion'];
  }

  getNameE() {
    return this.componentComms.getNameE();
  }

  addHours( date ) {
    localStorage.setItem('dateToChange', date);
    this.router.navigate(['home/hours']);
  }

  aparicionBoton(){
    var originalSize = window.innerWidth + window.innerHeight;
    var sendButton = document.getElementById("sendBtn");
    window.addEventListener("resize", () => {
      (window.innerHeight + window.innerWidth !== originalSize) ? sendButton.style.display = "none" : sendButton.style.display = "flex";
    })
  }

  
  emptyLS() {
    for(let input of this.allInputs) localStorage.removeItem(input);
    for(let text of this.textAreas) localStorage.removeItem(text);
    for(let firmas of this.firmCanvas) localStorage.removeItem(firmas);
    localStorage.removeItem('hours');
    localStorage.removeItem('Consecutivo');
    console.log('LS is empty'); 
  }
  
  mostrar(campo: string, borrar:string, guardar:string){
    var canvas = <HTMLCanvasElement> document.getElementById(campo);
    var context = canvas.getContext('2d'); 
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;

    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y-55);
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

    // Listener to erase firm
    document.getElementById(borrar).addEventListener('mousedown', function(e){
      context.clearRect(0,0,500,250);
      clickX = [];
      clickY = [];
      clickDrag = [];
      localStorage.removeItem(campo);
      document.getElementById('checked' + campo).style.visibility = "hidden";
    });

    // Listener to save firm
    document.getElementById(guardar).addEventListener('mousedown', function(e){
      let canvas = <HTMLCanvasElement>document.getElementById(campo);
      localStorage.setItem(campo, canvas.toDataURL());
      document.getElementById('checked' + campo).style.visibility = "visible";
    })

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
      let signBorrar = document.getElementById(borrar);
      let signGuardar = document.getElementById(guardar);      
      signBorrar.style.visibility = 'hidden';
      signGuardar.style.visibility = 'hidden';
      setTimeout(() => {
        signBorrar.previousElementSibling.querySelector('.fas').classList.remove('fa-minus');
        signBorrar.previousElementSibling.querySelector('.fas').classList.add('fa-plus');
        canvas.style.visibility = 'hidden';
      }, 1000);
            
    }
    else{
      canvas.style.transition = "height 1s";
      canvas.style.visibility = 'visible';
      canvas.style.height = '250px';
      canvas.style.width = '500px';
      canvas.style.margin = "auto";
      let signBorrar = document.getElementById(borrar);
      let signGuardar = document.getElementById(guardar);
      signBorrar.style.visibility = 'visible';
      signGuardar.style.visibility = 'visible';
      signBorrar.previousElementSibling.querySelector('.fas').classList.remove('fa-plus');
      signBorrar.previousElementSibling.querySelector('.fas').classList.add('fa-minus');
    }
  }

  resizeAndSetTextArea() {
    for (let id of this.textAreas) {
      let item = <HTMLTextAreaElement>document.getElementById(id);
      item.value = localStorage.getItem(id);

      //Event listener para guardar contenido del input al perder focus
      item.addEventListener('blur', () => {
        localStorage.setItem(id, String(item.value));
      });

      // Event listener para acomodar tamaño del textarea, REVISAR
      for (let event of ['keydown', 'change', 'paste', 'cut', 'drop', 'onkeydown', 'onchange', 'onpaste', 'oncut', 'ondrop']) {
        item.addEventListener(event, () => { if(item.scrollTop != 0) item.style.height = item.scrollHeight + 10 +"px"; })
      }      
    }
  }

  SetCanvas() {
    for (let id of this.firmCanvas) {
      let item = <HTMLCanvasElement>document.getElementById(id);
      let firma = localStorage.getItem(id);
      // Carga firma si ya existia anterirormente
      if (firma !== "") {
        let ctx = item.getContext("2d");
        let image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
        }
        image.src = firma;
        if(firma !== this.whiteCanvas && firma !== "" && firma !== null && firma !== 'null') document.getElementById('checked' + id).style.visibility = "visible";
      }
    }
  }

  saveAndSetInputValues() {
    for (let id of this.allInputs) {
      let item = <HTMLInputElement>document.getElementById(id);
      item.value = localStorage.getItem(id);
      
      // Event listener para guardar datos cuando el input pierde focus
      item.addEventListener('blur', () => {
        localStorage.setItem(id, String(item.value));
      })
    }
  }

  // Para file input
  changeFiles(event){
    this.imagenes="";
    var files = event.target.files;
    console.log("files", files) 
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var picReader = new FileReader();
      picReader.addEventListener("load", (event:any) => {
          var picFile = event.target;
          this.imagenes = this.imagenes + String(picFile.result);
      });
      picReader.readAsDataURL(file);
    }
    let label = <HTMLLabelElement>document.getElementById('label-camara');
    label.innerHTML = (files.length > 0)? '<i class="fas fa-paperclip"></i>  ' + files.length + ' archivos' : '<i class="fas fa-paperclip"></i> Elige archivos';
  }

  crearReporte( tipo ){
    var nombreCliente = <HTMLInputElement> document.getElementById('NombreEmpresa');
    var NombreCliente = nombreCliente.value;

    var nombreContacto = <HTMLInputElement> document.getElementById('NombreContacto');
    var NombreContacto = nombreContacto.value;

    
    var nombreColaborador = <HTMLInputElement> document.getElementById('NombreE');
    var NombreColaborador = nombreColaborador.value;

    var nombreProyecto = <HTMLInputElement> document.getElementById('NombreProyecto');
    var NombreProyecto = nombreProyecto.value;
  
    var descripcionAlcance = <HTMLTextAreaElement> document.getElementById('DescripcionAlcance');
    var DescripcionAlcance = descripcionAlcance.value;

    var hojaTiempo = this.hours;

    var marca = <HTMLInputElement> document.getElementById('NombreMarca');
    var Marca = marca.value;

    var denominacionInterna = <HTMLInputElement> document.getElementById('DenominacionInterna');
    var DenominacionInterna = denominacionInterna.value;

    var numeroProducto = <HTMLInputElement> document.getElementById('NumeroProducto');
    var NumeroProducto = numeroProducto.value;

    var numeroSerial = <HTMLInputElement> document.getElementById('NumeroSerial');
    var NumeroSerial = numeroSerial.value;

    var caracteristicasTecnicas = <HTMLInputElement> document.getElementById('CaracteristicasTecnicas');
    var CaracteristicasTecnicas = caracteristicasTecnicas.value;

    var estadoInicial = <HTMLInputElement> document.getElementById('EstadoInicial');
    var EstadoInicial = estadoInicial.value;

    var actividadesRealizadas = <HTMLTextAreaElement> document.getElementById('ActividadesRealizadas');
    var ActividadesRealizadas = actividadesRealizadas.value;

    var conclusionesRecomendaciones = <HTMLTextAreaElement> document.getElementById('ConclusionesRecomendaciones');
    var ConclusionesRecomendaciones = conclusionesRecomendaciones.value;

    var repuestosSugeridos = <HTMLTextAreaElement> document.getElementById('RepuestosSugeridos');
    var RepuestosSugeridos = repuestosSugeridos.value;

    var actividadesPendientes = <HTMLTextAreaElement> document.getElementById('ActividadesPendientes');
    var ActividadesPendientes = actividadesPendientes.value;


    var campoE = <HTMLCanvasElement> document.getElementById('campoEmisor');
    var imagencampoE = campoE.toDataURL();

    var campoCli = <HTMLCanvasElement> document.getElementById('campoCliente');
    var imagencampoCli = campoCli.toDataURL();
    var timeStampCreacion = new Date();
    let date = timeStampCreacion.getDate();
    let month = timeStampCreacion.getMonth() + 1;
    let year = timeStampCreacion.getFullYear();
    let realDate = (date < 10 ) ? String('0' + date) : String (date);
    let realMonth = (month < 10) ? String( '0' + month ) : String(month);
    let FechaCreacion = String(year) + '-' + realMonth + '-' + realDate;

    var saveIDB = {
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
        'FirmaCliente' : imagencampoCli,
        'IdAsignacion' : this.assignment,
        'FechaEnvio' : FechaCreacion,
        'Adjuntos' : this.imagenes
    }

    var datos = {
        'NombreEmpresa' : NombreCliente,
        'NombreContacto' : NombreContacto,
        'NombreE' : NombreColaborador,
        'NombreProyecto' : NombreProyecto,
        'descripcionAlcance' : DescripcionAlcance,
        'hours' : hojaTiempo,
        'NombreMarca' : Marca,
        'DenominacionInterna' : DenominacionInterna,
        'NumeroProducto' : NumeroProducto,
        'NumeroSerial' : NumeroSerial,
        'CaracteristicasTecnicas' : CaracteristicasTecnicas,
        'EstadoInicial' : EstadoInicial,
        'actividadesRealizadas' : ActividadesRealizadas,
        'conclusionesRecomendaciones' : ConclusionesRecomendaciones,
        'repuestosSugeridos' : RepuestosSugeridos,
        'actividadesPendientes' : ActividadesPendientes,
        'campoEmisor' : imagencampoE,
        'campoCliente' : imagencampoCli
    }
    return (tipo === "LS")? saveIDB : datos;
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
      let reporte = this.crearReporte("enviar");
      (online)? this.enviarReporte(reporte) : this.guardarReporte(reporte);
    })    
  }

  guardarReporte( reporte ){
    this.idb.saveReport(reporte);
    console.log('Reportes: \n', this.idb.getAllReports( this.idb.nuevoConsecutivo() ));
  }

  enviarReporte( reporte ) {
    console.log('Online :)');
    Swal.showLoading();
    this.httpRequest.postData(url + '/api/saveGeneralReport', JSON.stringify(reporte)). then( result => {
      if (result == "false") Swal.fire({type: "error", title: "Error", text: "Error en subir reporte"});
      else {
        // Saves user number
        Swal.fire({type: "success", title: "Exito", text: 'Reporte enviado'})
          .then(() => { this.router.navigate(['home/details']) });
      }
    });
  }


}