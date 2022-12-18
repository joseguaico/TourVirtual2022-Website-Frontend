import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { UsuariosService } from 'src/app/services/usuarios.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-usuario-modal',
  templateUrl: './borrar-usuario-modal.component.html',
  styleUrls: ['./borrar-usuario-modal.component.css']
})
export class BorrarUsuarioModalComponent implements OnInit {

  @ViewChild('mdlUsuarioBorrar') mdlUsuarioBorrar!: ElementRef;

  @Output('onUsuarioBorrado') onUsuarioBorrado: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Confirmar eliminación de usuario';
  contenidoPublicar = '';

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  private codxUsuario = '';
  nombreCompleto = '';
  email = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }

   
  mostrarModal(codXUsuario: string, nombreCompleto: string, email: string){
    this.reiniciarOverlay();
    this.codxUsuario = codXUsuario;
    this.nombreCompleto = nombreCompleto;
    this.email = email;
    this.mostrarDetalles = true;

    $(this.mdlUsuarioBorrar.nativeElement).modal('show');
  }

  cerrarModal(){
    $(this.mdlUsuarioBorrar.nativeElement).modal('hide');
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

  enviarBorrarUsuario(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.usuariosService.eliminarUsuario(this.codxUsuario).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const usuarioBorrado: Usuario = resp.datos as Usuario;
          this.onUsuarioBorrado.emit({idUsuario: usuarioBorrado.uid,
            nombreCompleto: usuarioBorrado.nombres + ' ' + usuarioBorrado.apellidos, 
            email: usuarioBorrado.email});
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
