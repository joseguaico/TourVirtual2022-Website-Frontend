import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';

declare let $ : any;

@Component({
  selector: 'app-cambiar-foto-modal',
  templateUrl: './cambiar-foto-modal.component.html',
  styleUrls: ['./cambiar-foto-modal.component.css']
})
export class CambiarFotoModalComponent implements OnInit {

  formCambiarFoto: FormGroup = this.fb.group({
    sceneCambiar: ['-1', [] ],
  });

  @Input("imagenes360")imagenes360: Imagen360[] = [];

  @ViewChild('mdlCambiarImagen') mdlCambiarImagen!: ElementRef;

  @Output('cambiarOtraFoto') cambiarOtraFoto: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Cambiar a otra imagen 360';
  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  mostrarInfoOverlay = false;
  codImagenActual = '';

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
  }

  mostrarModal(codImagenActual: string){
    this.reiniciarOverlay();
    this.formCambiarFoto.reset();
    this.formCambiarFoto.get('sceneCambiar')?.setValue('-1');
    this.codImagenActual = codImagenActual;
    $(this.mdlCambiarImagen.nativeElement).modal('show');
  }


  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  seleccionValida(){
    return this.formCambiarFoto.get('sceneCambiar')?.value !=  "-1";
  }

  cerrarModalOverlay(){
    //console.log('cerrarModalOverlay...')
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    //console.log('cerrarModalAll...')
    this.cerrarModal();
  }

  cerrarModal(){
    $(this.mdlCambiarImagen.nativeElement).modal('hide');
    this.reiniciarOverlay();
  }

  guardarCambioFoto(){

    const fotoCambiar = this.formCambiarFoto.get('sceneCambiar')?.value;

    if (fotoCambiar != '-1'){
      //console.log('Cambiar a: ', fotoCambiar);
      this.cambiarOtraFoto.emit({codFotoCambiar: fotoCambiar});
      this.cerrarModalAll();
    }

  }

}
