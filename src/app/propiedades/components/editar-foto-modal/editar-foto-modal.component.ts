import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
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

  @Output('onPostEditarFoto') onPostEditarFoto: EventEmitter<any> = new EventEmitter();

  @ViewChild('mdlEditarFoto') mdlEditarFoto!: ElementRef;
  cargando = false;
  textoTitulo = 'Editar';
  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codPropiedad: string = '';
  codFoto360: string = '';
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

  mostrarModal(codXFoto: string, tituloFoto: string, codXPropiedad: string){
    this.reiniciarOverlay();
    this.reiniciarForm();

    this.codFoto360 = codXFoto;
    this.codPropiedad = codXPropiedad;
    this.textoTitulo = 'Editar ' + tituloFoto;
    this.formEditarFoto.get('titulo')?.setValue(tituloFoto);
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

    const {titulo} = this.formEditarFoto.value;
    const editarFoto: boolean = this.formEditarFoto.get('checkEditarFoto') !== null ? this.formEditarFoto.get('checkEditarFoto')!.value : false;
    const foto360: File | null = this.formEditarFoto.get('foto')?.value !== null ? (document.getElementById('flFoto360Editar') as HTMLInputElement).files![0] : null;

    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.imagenes360.editarImagen360AndFoto(this.codFoto360, this.codPropiedad, titulo, editarFoto, foto360).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

     // console.log(resp);

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const fotoEditada = resp.datos as Imagen360;


          this.onPostEditarFoto.emit({mensaje: 'Foto 360 editada exitosamente', 
            idFoto: this.codFoto360,
            titulo: fotoEditada.descripcion,
            edicionArchivoFoto: editarFoto});
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

  agregarValidacionFile(agregar: boolean){
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
