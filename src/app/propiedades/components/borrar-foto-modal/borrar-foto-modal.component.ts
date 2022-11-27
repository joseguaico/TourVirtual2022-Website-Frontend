import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-foto-modal',
  templateUrl: './borrar-foto-modal.component.html',
  styleUrls: ['./borrar-foto-modal.component.css']
})
export class BorrarFotoModalComponent implements OnInit {

  @Output('recargarFotos') recargarFotosEmitter: EventEmitter<any> = new EventEmitter();

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

  constructor(private imagenes360: Imagenes360Service) { }

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

  }
  cerrarModalOverlay(){
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    this.cerrarModal();
  }

}
