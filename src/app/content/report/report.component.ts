import { Component, OnInit } from '@angular/core';
import { ComponentsCommsService } from '../../components-comms.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  private textAreas = [ 'descripcionAlcance', 'actividadesRealizadas', 'conclusionesRecomendaciones', 'repuestosSugeridos', 'actividadesPendientes' ];
  //private textAreas = [ 'descripcionAlcance' ];
  hours = [];

  constructor(private componentComms: ComponentsCommsService) { }

  ngOnInit() {
    this.componentComms.setBackStatus(true);
    this.hours = this.componentComms.getHours()['hours'];
    this.resizeTextArea();
  }

  mostrar(campo: string, borrar:string){
    var canvas = <HTMLCanvasElement>document.getElementById(campo);
    var context = canvas.getContext('2d'); 
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;

    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }

    function redraw(){
      context.strokeStyle = "black";
      context.lineJoin = "round";
      context.lineWidth = 3;
          
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

    canvas.addEventListener('mousedown', function(e){
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
        
      paint = true;
      addClick(mouseX, mouseY, true);
      redraw();
    });

    document.getElementById(borrar).addEventListener('mousedown', function(e){
      context.clearRect(0,0,900,250);
      clickX = [];
      clickY = [];
      clickDrag = [];
    });

    canvas.addEventListener('mousemove', function(e){
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    });

    canvas.addEventListener('mouseup', function(e){
      paint = false;
    });

    canvas.addEventListener('mouseleave', function(e){
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
    canvas.style.width = '92%';
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


}
