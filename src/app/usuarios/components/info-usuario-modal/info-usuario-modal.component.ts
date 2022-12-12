import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuarioInfo } from 'src/app/interfaces/usuarioInfo.interface';
import { RolesConstantes } from 'src/app/models/constantes';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { UsuariosService } from 'src/app/services/usuarios.service';

declare let $ : any;

@Component({
  selector: 'app-info-usuario-modal',
  templateUrl: './info-usuario-modal.component.html',
  styleUrls: ['./info-usuario-modal.component.css']
})
export class InfoUsuarioModalComponent implements OnInit {

  @ViewChild('mdlInfoUsuarioView') mdlInfoUsuarioView!: ElementRef;
  
  cargando = false;
  textoTitulo = "Detalle del usuario";
  mostrarDetalles = true;
  mostrarMensaje = false;
  mensaje = "";
  usuario: UsuarioInfo | null = null;
  mostrarCliente = false;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }
  
  cerrarModal(){
    $(this.mdlInfoUsuarioView.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.mostrarMensaje = false;
    this.mensaje = "";
    this.usuario = null;
  }

  public realizarBusqueda(codigoX: string){

    this.cargando = true;
    this.mostrarDetalles = false;
    $(this.mdlInfoUsuarioView.nativeElement).modal('show');

    this.usuariosService.obtenerInfoUsuario(codigoX).subscribe((resp: GeneralResponse) => 
    {
      this.cargando = false;

        if(resp.tieneError){
          this.mensaje = resp.message;
        }else{
          this.mensaje = "";
          this.usuario = resp.datos as UsuarioInfo;
          this.mostrarCliente = this.usuario.rol.codigo === RolesConstantes.ROL_CORREDOR;
          this.mostrarDetalles = true;
         // console.log(resp);
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
