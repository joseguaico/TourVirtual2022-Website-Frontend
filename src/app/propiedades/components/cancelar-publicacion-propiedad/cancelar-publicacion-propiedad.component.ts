import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { PropiedadesService } from 'src/app/services/propiedades.service';

declare let $ : any;

@Component({
  selector: 'app-cancelar-publicacion-propiedad',
  templateUrl: './cancelar-publicacion-propiedad.component.html',
  styleUrls: ['./cancelar-publicacion-propiedad.component.css']
})
export class CancelarPublicacionPropiedadComponent implements OnInit {

  
  @ViewChild('mdlCancelarPublicacion') mdlCancelarPublicacion!: ElementRef;

  @Output('onPropiedadCancelada') onPropiedadCancelada: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Suspender publicación de propiedad';
  contenidoPublicar = '';

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  private codxPropiedad: string = '';
  codigoPropiedad!: number;
  tituloPropiedad = '';
  
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
  }
  
  mostrarModal(codXPropiedad: string, codigoPropiedad: number, tituloPropiedad: string){
    this.reiniciarOverlay();
    this.codxPropiedad = codXPropiedad;
    this.codigoPropiedad = codigoPropiedad;
    this.tituloPropiedad = tituloPropiedad;
    this.mostrarDetalles = true;
    $(this.mdlCancelarPublicacion.nativeElement).modal('show');
  }


  cerrarModal(){
    $(this.mdlCancelarPublicacion.nativeElement).modal('hide');
    this.reiniciarOverlay();
  }
  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  cerrarModalOverlay(){
    //console.log('cerrarModalOverlay...')
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    //console.log('cerrarModalAll...')
    this.cerrarModal();
  }

  enviarCancelacion(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.propiedadesService.cancelarPublicacion(this.codxPropiedad).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const propiedadPublicada: PropiedadInfo = resp.datos as PropiedadInfo;
          this.onPropiedadCancelada.emit({propiedad: propiedadPublicada});
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
