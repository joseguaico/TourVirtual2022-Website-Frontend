import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-foto-modal',
  templateUrl: './borrar-foto-modal.component.html',
  styleUrls: ['./borrar-foto-modal.component.css']
})
export class BorrarFotoModalComponent implements OnInit {

  @Output('onPostBorrarFoto') onPostBorrarFoto: EventEmitter<any> = new EventEmitter();

  @ViewChild('mdlBorrarFoto') mdlBorrarFoto!: ElementRef;

  textoConfirmarEliminacion = '¿Está seguro que desea eliminar la foto ".., " y toda su información relacionada?';
  cargando = false;
  textoTitulo = 'Eliminar foto ';
  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codPropiedad: string = '';
  codFoto360: string = '';
  mostrarInfoOverlay = false;

  constructor(private imagenes360Service: Imagenes360Service) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $(this.mdlBorrarFoto.nativeElement).modal('hide');  
    this.reiniciarOverlay();
  }

  reiniciarForm(){
    this.textoTitulo = "";
    this.textoConfirmarEliminacion = "";
  }

  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  mostrarModal(codXFoto: string, tituloFoto: string, codXPropiedad: string){
    this.reiniciarOverlay();
    this.reiniciarForm();

    this.codFoto360 = codXFoto;
    this.codPropiedad = codXPropiedad;
    this.textoTitulo = 'Eliminar ' + tituloFoto;
    this.textoConfirmarEliminacion = `¿Está seguro que desea eliminar la foto "${tituloFoto}" y toda su información relacionada?`;
    $(this.mdlBorrarFoto.nativeElement).modal('show');
  }

  guardarEliminacionFoto(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.imagenes360Service.eliminarImagen360(this.codPropiedad, this.codFoto360).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

     // console.log(resp);

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const imagenBorrada: Imagen360 = resp.datos as Imagen360;
          this.onPostBorrarFoto.emit({mensaje: this.textoPosteriorCambio, idFoto: imagenBorrada.id});
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
  cerrarModalOverlay(){
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    this.cerrarModal();
  }

}
