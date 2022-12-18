import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { PropiedadesService } from 'src/app/services/propiedades.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-propiedad-modal',
  templateUrl: './borrar-propiedad-modal.component.html',
  styleUrls: ['./borrar-propiedad-modal.component.css']
})
export class BorrarPropiedadModalComponent implements OnInit {

  @ViewChild('mdlPropiedadBorrar') mdlPropiedadBorrar!: ElementRef;

  @Output('onPropiedadBorrada') onPropiedadBorrada: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Confirmar eliminación de propiedad';
  contenidoPublicar = '';

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codigoPropiedad = -1;
  codxPropiedad = '';
  tituloPropiedad = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
  }

   
  mostrarModal(codxPropiedad: string, codigoPropiedad: number, tituloPropiedad: string){
    this.reiniciarOverlay();
    this.codxPropiedad = codxPropiedad;
    this.codigoPropiedad = codigoPropiedad;
    this.tituloPropiedad = tituloPropiedad;
    this.mostrarDetalles = true;

    $(this.mdlPropiedadBorrar.nativeElement).modal('show');
  }

  cerrarModal(){
    $(this.mdlPropiedadBorrar.nativeElement).modal('hide');
    this.reiniciarOverlay();
  }
  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  cerrarModalOverlay(){
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    this.cerrarModal();
  }

  enviarBorrarVenta(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.propiedadesService.eliminarPropiedad(this.codxPropiedad).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          

          const propiedadBorrada: PropiedadInfo = resp.datos as PropiedadInfo;
          this.onPropiedadBorrada.emit({codigoPropiedad: propiedadBorrada.codigo, codxPropiedad: propiedadBorrada.uidx });
          this.cerrarModalAll();
        }
        this.mostrarInfoOverlay = true;
    },
    (err: any) => {
      const {message, error} = err.error;
      this.actualizando = false;
      this.textoPosteriorCambio = message;
      this.mostrarInfoOverlay = true;
      this.mostrarCerrarOverlay = true;
    });
  }


}
