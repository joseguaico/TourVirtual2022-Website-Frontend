import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from 'src/app/services/propiedades.service';

import * as bootstrap from "bootstrap";
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';

@Component({
  selector: 'app-info-propiedad-modal',
  templateUrl: './info-propiedad-modal.component.html',
  styleUrls: ['./info-propiedad-modal.component.css']
  })
export class InfoPropiedadModalComponent implements OnInit {

  cargando = true;
  mostrarDetalles = true;
  mostrarModal = true;
  textoTitulo = "Detalle de la propiedad";
  mostrarMensaje = false;
  mensaje = "";
  propiedad: PropiedadInfo | null = null;


  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $('#mdlInfoPropiedadView').modal('hide');
    this.mostrarDetalles = false;
    this.mostrarMensaje = false;
    this.mensaje = "";
    this.propiedad = null;
  }

  public realizarBusqueda(codigoX: string){

    this.cargando = true;
    this.mostrarDetalles = false;
    $("#mdlInfoPropiedadView").modal('show');

    this.propiedadesService.obtenerPropiedadTitulo(codigoX).subscribe((resp: GeneralResponse) => 
    {
      this.cargando = false;

        if(resp.tieneError){
          this.mensaje = resp.message;
        }else{
          this.mensaje = "";
          this.propiedad = resp.datos as PropiedadInfo;
          this.mostrarDetalles = true;
          console.log(resp);
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
