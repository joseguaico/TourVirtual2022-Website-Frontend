import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy } from '@angular/router';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AlertMensajeComponent } from 'src/app/shared/components/alert-mensaje/alert-mensaje.component';
import { PaginationSizes } from 'src/app/shared/lists/paginationSizes';
import { BorrarUsuarioModalComponent } from '../components/borrar-usuario-modal/borrar-usuario-modal.component';
import { InfoUsuarioModalComponent } from '../components/info-usuario-modal/info-usuario-modal.component';

@Component({
  selector: 'app-busqueda-usuarios',
  templateUrl: './busqueda-usuarios.component.html',
  styleUrls: ['./busqueda-usuarios.component.css']
})
export class BusquedaUsuariosComponent implements OnInit {

  currentPage: number = 1;
  pageSize: number = 10;
  pagesCount: number = 1;
  paginationSizes: number[] = PaginationSizes;
  showPagination: boolean = false;
  showFirst: boolean = false;
  showPrevious: boolean = false;
  showNext: boolean = false;
  showLast: boolean = false;

  auxEmailPrev: string = '';
  auxNombresPrev: string = '';
  auxRolPrev: string = '';

  formBusqueda: FormGroup = this.fb.group({
    email: ['',],
    nombres: ['',],
    rol: ['',]
  });

  formPaginator: FormGroup = this.fb.group({
    ddlPageSize: [this.pageSize]
  });


  roles: Rol[] = [];
  usuarios: Usuario[] = [];
  
  public cargando = false;
  public textoRespuestaBusqueda = '';

  @ViewChild(InfoUsuarioModalComponent) modalInfo!: InfoUsuarioModalComponent;
  @ViewChild(BorrarUsuarioModalComponent) modalBorrarUsuario!: BorrarUsuarioModalComponent;
  @ViewChild(AlertMensajeComponent) alertMensaje!: AlertMensajeComponent;


  constructor(public fb: FormBuilder, private router: Router,
    private usuariosService: UsuariosService,
    private rolesService: RolesService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Búsqueda de usuarios');
    this.obtenerRoles();
    this.formBusqueda.get('rol')?.setValue("");
    const { email, nombres, rol} = this.formBusqueda.value;
    this.realizarBusqueda(email, nombres, rol);
  }

  buscarClick(){
    const { email, nombres, rol} = this.formBusqueda.value;
    this.realizarBusqueda(email, nombres, rol);
  }

  obtenerRoles(){
    this.rolesService.obtenerRoles().subscribe((resp: any) => {
      this.roles = resp.datos as Rol[];
    });
  }


  realizarBusqueda(email: string, nombres: string, rol: string){
    
    this.auxEmailPrev = email;
    this.auxNombresPrev = nombres;
    this.auxRolPrev = rol;

    this.cargando = true;

    this.usuariosService.obtenerUsuarios(email, nombres, rol, this.currentPage, this.pageSize)
      .subscribe((resp: any) => {
        this.usuarios = resp.datos;
        this.showFirst = resp.showFirst;
        this.showPrevious = resp.showPrevious;
        this.showNext = resp.showNext;
        this.showLast = resp.showLast;
        this.showPagination = resp.showPagination;
        this.pagesCount = resp.totalPages;

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


  onDdlPageSizeChange(){
    this.pageSize = this.formPaginator.get('ddlPageSize')?.value;
    this.currentPage = 1;
    this.paginarBusquedaPageSize();
  }

  paginarBusquedaPageSize(){
    this.realizarBusqueda(this.auxEmailPrev, this.auxNombresPrev, this.auxRolPrev);
  }
  paginarBusqueda(newPage: number){
    this.currentPage = newPage;
    this.paginarBusquedaPageSize();
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
  onClickEliminar(usuario: Usuario){
    this.modalBorrarUsuario.mostrarModal(usuario.uid, `${usuario.nombres.trim()} ${usuario.apellidos.trim()}` , usuario.email.trim());
  }

  onUsuarioBorrado(idUsuario: string, nombreCompleto: string, email: string){
    this.alertMensaje.mostrarAlert(`Usuario "${nombreCompleto}" borrado exitosamente.`);
    this.removerUsuarioDelArray(idUsuario);
    this.paginarBusqueda(1);
  }

  removerUsuarioDelArray(idUsuario: string){
    this.usuarios = this.usuarios.filter(f => f.uid.trim().toLowerCase() !== idUsuario.trim().toLowerCase());
  }


}
