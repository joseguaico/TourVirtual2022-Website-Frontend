import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

declare let $ : any;

@Component({
  selector: 'app-alert-mensaje',
  templateUrl: './alert-mensaje.component.html',
  styleUrls: ['./alert-mensaje.component.css']
})
export class AlertMensajeComponent {
  
  @ViewChild('divMensaje') divMensaje!: ElementRef;
  
  visible = false;
  textoAlert = "";

  constructor() { }

  mostrarAlert(texto: string){

    this.textoAlert = texto;
    this.visible = true;
   // $(this.divMensaje.nativeElement).show();
    //setTimeout(() => { $(this.divMensaje.nativeElement).hide(); }, 4000);
    const timer = setTimeout(() => { 
      this.visible = false; 
      clearTimeout(timer);
    }, 4000);
  }

  cerrarAlert(){
    this.visible = false;

  }


}
