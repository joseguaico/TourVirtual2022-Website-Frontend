import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';

declare let $ : any;

@Component({
  selector: 'app-editar-foto-modal',
  templateUrl: './editar-foto-modal.component.html',
  styleUrls: ['./editar-foto-modal.component.css']
})
export class EditarFotoModalComponent implements OnInit {

  formEditarFoto: FormGroup = this.fb.group({
    titulo: ['', [Validators.required] ],
    checkEditarFoto: [false, ],
    foto: [null, [] ],
  });

  @Output('recargarFotos') recargarFotosEmitter: EventEmitter<any> = new EventEmitter();

  @ViewChild('mdlEditarFoto') mdlEditarFoto!: ElementRef;
  cargando = false;
  textoTitulo = 'Editar';
  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codPropiedad: string = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;
  mostrarInputFoto = false;

  constructor(private fb: FormBuilder,
    private imagenes360: Imagenes360Service) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $(this.mdlEditarFoto.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.reiniciarOverlay();
  }

  reiniciarForm(){
    this.formEditarFoto.reset();
    this.agregarValidacionFile(false);
    this.mostrarInputFoto = false;
  }

  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  campoNoValido(campo: string){
    return this.formEditarFoto.controls[campo].errors && this.formEditarFoto.controls[campo].touched;
  }

  mostrarModal(codXPropiedad: string, tituloPropiedad: string){
    this.reiniciarOverlay();
    this.reiniciarForm();

    this.codPropiedad = codXPropiedad;
    this.textoTitulo = 'Editar ' + tituloPropiedad;
    this.mostrarDetalles = true;
    $(this.mdlEditarFoto.nativeElement).modal('show');
  }


  cerrarModalOverlay(){
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    this.cerrarModal();
  }

  guardarEdicionFoto() {
    if (this.formEditarFoto.invalid){
      return this.formEditarFoto.markAllAsTouched();    
    }    

    console.log('guardarEdicionFoto', this.formEditarFoto.valid, this.formEditarFoto.value);
  }

  agregarValidacionFile(agregar: boolean){
    console.log('agregarValidacionFile: ', agregar);
    if(agregar){
      this.formEditarFoto.get('foto')?.clearValidators();
      this.formEditarFoto.get('foto')?.setValidators(Validators.required);
    }else{
      this.formEditarFoto.get('foto')?.clearValidators();
    }
    this.formEditarFoto.get('foto')?.reset();
    this.formEditarFoto.get('foto')?.updateValueAndValidity();
  }


  onCheckEditarFotoChanged(event: Event){
   const checked = this.formEditarFoto.get('checkEditarFoto')?.value;
   this.agregarValidacionFile(checked);
   this.mostrarInputFoto = checked;
   
  }
}
