import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Rol } from 'src/app/interfaces/rol.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Usuario } from 'src/app/models/usuario.class';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { InfoUsuarioModalComponent } from '../components/info-usuario-modal/info-usuario-modal.component';

@Component({
  selector: 'app-busqueda-usuarios',
  templateUrl: './busqueda-usuarios.component.html',
  styleUrls: ['./busqueda-usuarios.component.css']
})
export class BusquedaUsuariosComponent implements OnInit {

  formBusqueda: FormGroup = this.fb.group({
    email: ['',],
    nombres: ['',],
    rol: ['',]
  });

  roles: Rol[] = [];
  usuarios: Usuario[] = [];

  private pageNumber: number = 1;
  private pageSize: number = 10;
  public cargando = false;
  public textoRespuestaBusqueda = '';

  @ViewChild(InfoUsuarioModalComponent) modalInfo!: InfoUsuarioModalComponent;

  constructor(public fb: FormBuilder, private router: Router,
    private usuariosService: UsuariosService,
    private rolesService: RolesService) { }

  ngOnInit(): void {
    this.obtenerRoles();
    this.formBusqueda.get('rol')?.setValue("");
    this.realizarBusqueda();
  }

  buscarClick(){
    this.realizarBusqueda();
  }

  obtenerRoles(){
    this.rolesService.obtenerRoles().subscribe((resp: any) => {
      this.roles = resp.datos as Rol[];
    });
  }


  realizarBusqueda(){
    const { email, nombres, rol} = this.formBusqueda.value;

    this.cargando = true;

    this.usuariosService.obtenerUsuarios(email, nombres, rol, this.pageNumber, this.pageSize)
      .subscribe((resp: any) => {
        this.usuarios = resp.datos;
        this.cargando = false;
        this.textoRespuestaBusqueda = this.usuarios.length === 0 ? 'No se encontraron datos' : '';

      },
      (err: any) => {
        const {message, error} = err.error;
        this.cargando = false;
        this.textoRespuestaBusqueda = message;
        this.usuarios = [];
      });
  }


  crearClick(){
    this.router.navigate(['usuarios/crear-usuario'])
  }

  onClickVerDetalle(idUsuario: string){
    this.modalInfo.realizarBusqueda(idUsuario);
  }
  onClickEditar(idUsuario: string){
    this.router.navigate(['usuarios/editar-usuario'],  { queryParams: { cod: idUsuario} })
  }
  onClickEliminar(idUsuario: string){

  }


}
