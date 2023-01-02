import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PropiedadesService } from 'src/app/services/propiedades.service';

import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';

declare let $ : any;
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-info-propiedad-modal',
  templateUrl: './info-propiedad-modal.component.html',
  styleUrls: ['./info-propiedad-modal.component.css']
  })
export class InfoPropiedadModalComponent implements OnInit {


  @ViewChild('mdlInfoPropiedadView') mdlInfoPropiedadView!: ElementRef;

  @Output('onInfoPropiedadRecibida') onInfoPropiedadRecibida: EventEmitter<any> = new EventEmitter();


  cargando = true;
  mostrarDetalles = true;
  mostrarModal = true;
  textoTitulo = "Detalle de la propiedad";
  mostrarMensaje = false;
  mensaje = "";
  propiedad: PropiedadInfo | null = null;
  mostrarLinkPublicacion = false;


  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $(this.mdlInfoPropiedadView.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.mostrarMensaje = false;
    this.mensaje = "";
    this.propiedad = null;
  }

  public realizarBusqueda(codigoX: string){

    this.cargando = true;
    this.mostrarDetalles = false;
    $(this.mdlInfoPropiedadView.nativeElement).modal('show');

    this.propiedadesService.obtenerInfoPropiedad(codigoX).subscribe((resp: GeneralResponse) => 
    {
      this.cargando = false;

      //console.log(resp);  

      if(resp.tieneError === false){
        this.mensaje = "";
        this.propiedad = resp.datos as PropiedadInfo;
        this.mostrarLinkPublicacion = this.propiedad.linkPublicacion !== null;
        this.mostrarDetalles = true;

        this.onInfoPropiedadRecibida.emit({propiedad: this.propiedad});

      }else{
        this.mensaje = resp.message;
      }
    },
    (err: any) => {
      const {message, error} = err.error;
      this.cargando = false;
      this.mostrarDetalles = false
      this.mensaje = message;
    });
  }

  
}
