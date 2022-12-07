import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';

declare let $ : any;

@Component({
  selector: 'app-agregar-foto-modal',
  templateUrl: './agregar-foto-modal.component.html',
  styleUrls: ['./agregar-foto-modal.component.css']
})
export class AgregarFotoModalComponent implements OnInit {

  formAddFoto: FormGroup = this.fb.group({
    titulo: ['', [Validators.required] ],
    foto: [null, [Validators.required] ],
  });

  @Output('recargarFotos') recargarFotosEmitter: EventEmitter<any> = new EventEmitter();

  @ViewChild('mdlAgregarFoto') mdlAgregarFoto!: ElementRef;
  cargando = false;
  textoTitulo = 'Agregar foto 360';
  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codPropiedad: string = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private fb: FormBuilder,
    private imagenes360: Imagenes360Service) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $(this.mdlAgregarFoto.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.reiniciarOverlay();
  }

  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  campoNoValido(campo: string){
    return this.formAddFoto.controls[campo].errors && this.formAddFoto.controls[campo].touched;
  }

  mostrarModal(codXPropiedad: string){
    this.reiniciarOverlay();
    this.formAddFoto.reset();


    this.codPropiedad = codXPropiedad;
    this.mostrarDetalles = true;
    $(this.mdlAgregarFoto.nativeElement).modal('show');
  }


  cerrarModalOverlay(){
    //console.log('cerrarModalOverlay...')
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    //console.log('cerrarModalAll...')
    this.cerrarModal();
  }

  guardarFoto(){
    if (this.formAddFoto.invalid){
      return this.formAddFoto.markAllAsTouched();      
    }    

    const {titulo} = this.formAddFoto.value;
    const foto360: File = (document.getElementById('flFoto360') as HTMLInputElement).files![0];

    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.imagenes360.guardarImagen360(this.codPropiedad, titulo, foto360).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

     // console.log(resp);

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          this.recargarFotosEmitter.emit({mensaje: 'Foto 360 guardada exitosamente'});
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
