import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, tap } from 'rxjs';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { UsuarioInfo } from 'src/app/interfaces/usuarioInfo.interface';
import { RolesConstantes } from 'src/app/models/constantes';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  formEditar: FormGroup = this.fb.group({
    nombres: ['', [Validators.required] ],
    apellidos: ['', [Validators.required] ],
    estado: ['', [Validators.required] ],
    rol: ['', [Validators.required] ],
    cliente: ['', [] ],
    checkCambiarPassword: [false, ],
    password: ['', [] ],
  });

  cargando = true;

  roles: Rol[] = [];
  clientes: Cliente[] = [];
  mostrarCliente = false;
  mostrarPassword = false;

  checkCambiarPassword: boolean = false;
  codUsuarioEditar: string = '';
  usuarioEditar: UsuarioInfo | null = null;
  mostrarDetalle: boolean = true;
  mostrarFormularioPrincipal: boolean = false;
  mensajeCarga: string = '';

  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';

  constructor(public fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private rolesService: RolesService,
    private clientesService: ClientesService,
    private usuariosService: UsuariosService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.codUsuarioEditar = params.cod;

      this.cargando = true;

      if(this.codUsuarioEditar !== undefined && this.codUsuarioEditar !== '' ){
        this.mostrarDetalle = true;      
        this.setModoInicial();
        this.mostrarFormularioPrincipal = false;
        this.prepararDatos();
      }else{
        this.cargando = false;
        this.mostrarDetalle = false;
        this.mensajeCarga = "El enlace para editar el usuario no es válido.";
      }

    });
   
  }

 prepararDatos() {

  this.cargando = true;

  return forkJoin([this.obtenerClientes(), this.obtenerRoles(), this.obtenerUsuario()])
    .subscribe(([clientesResp, rolesResp, usuarioResp]: any) => { 

      // Clientes resp:
      this.clientes = clientesResp.datos as Cliente[];
      //this.formEditar.get('cliente')?.setValue("");  

      //console.log('Clientes: ', this.clientes);

      // Roles resp
      this.roles = rolesResp.datos as Rol[];      
      //this.formEditar.get('rol')?.setValue("");

      // Usuarios resp
      if (usuarioResp.tieneError === false){
        this.mostrarDetalle = true;
        this.usuarioEditar = usuarioResp.datos as UsuarioInfo;
        this.cargarUsuarioEnFormulario();
        this.mostrarFormularioPrincipal = true;
      }else{
        this.mostrarDetalle = false;
        this.mostrarFormularioPrincipal = false;
        this.mensajeCarga = usuarioResp.message;
      }

      //console.log('USUARIO RESP: ', usuarioResp);
      this.cargando = false;
    }, 
    (error) => {
      this.mostrarDetalle = false;
      this.mensajeCarga = "Se produjo un error al obtener los datos del usuario"
      console.error(error);
      this.cargando = false;
    })

 }

 obtenerClientes() : any{
  return this.clientesService.obtenerClientesAll();
 }

 obtenerRoles() : any{
  return this.rolesService.obtenerRoles();
 }

 obtenerUsuario(): any{
  return this.usuariosService.obtenerInfoUsuario(this.codUsuarioEditar);
 }

 cargarUsuarioEnFormulario(){

  console.log(this.usuarioEditar);

  if(this.usuarioEditar !== null){

    this.formEditar.get('nombres')?.setValue(this.usuarioEditar!.nombres);
    this.formEditar.get('apellidos')?.setValue(this.usuarioEditar!.apellidos);
    this.formEditar.get('rol')?.setValue(this.usuarioEditar!.rol?.codigo);
    this.formEditar.get('estado')?.setValue(this.usuarioEditar!.estado.toLowerCase());

    if (this.usuarioEditar!.rol?.codigo === RolesConstantes.ROL_CORREDOR){
      this.formEditar.get('cliente')?.setValue(this.usuarioEditar.cliente?.idx);
      this.mostrarCliente = true;
    }else{
      this.mostrarCliente = false;  
    }
  }
 }

  campoNoValido(campo: string){
    return this.formEditar.controls[campo].errors && this.formEditar.controls[campo].touched;
  }

  onRolChanged(){
    const rolValue = this.formEditar.get('rol')?.value;

    if (rolValue === RolesConstantes.ROL_CORREDOR){
      this.formEditar.get('cliente')?.setValue('');      
      this.formEditar.get('cliente')?.setValidators(Validators.required);
      this.mostrarCliente = true;
    }else{
      this.mostrarCliente = false;
      this.formEditar.get('cliente')?.clearValidators();
    }
    this.formEditar.get('cliente')?.reset();
    this.formEditar.get('cliente')?.updateValueAndValidity();
    this.formEditar.get('cliente')?.setValue('');
  }
  
  onCheckPasswordChanged(){
    this.mostrarPassword = this.formEditar.get('checkCambiarPassword')?.value;

    if (this.mostrarPassword === true){
      this.formEditar.get('password')?.setValue('');      
      this.formEditar.get('password')?.setValidators(Validators.required);
    }else{
      this.formEditar.get('password')?.clearValidators();
    }
    this.formEditar.get('password')?.reset();
    this.formEditar.get('password')?.updateValueAndValidity();

  }


  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.router.navigate(['usuarios/crear-usuario']);
  }

  redirectToBusqueda(){
    this.router.navigate(['usuarios/busqueda']);
  }
 
  setModoInicial(){
    this.formEditar.reset();
    this.formEditar.get('cliente')?.setValue('');
    this.formEditar.get('rol')?.setValue('');
    this.formEditar.get('estado')?.setValue('');
    this.formEditar.get('checkCambiarPassword')?.setValue(false);
    this.formEditar.get('password')?.setValue('');
    this.mostrarCliente = false;
    this.mostrarOverlay = false;
    this.mostrarLoading = false;
    this.mostrarInfoGeneral = false;
    this.textoOverlay = ''; 
    this.mostrarOpcionesPosteriores = false;
    this.textoOpcionesPosterior = '';
    this.mostrarFormularioPrincipal = true;
    this.mostrarPassword = false;
  }

  guardar(){

    if (this.formEditar.invalid){
      console.log(this.formEditar.errors);
      console.log(this.formEditar.value);
      return this.formEditar.markAllAsTouched();
    }  
   
    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    const {nombres, apellidos, password, estado, rol, cliente, checkCambiarPassword } = this.formEditar.value;

 
    this.usuariosService.editarUsuario(this.codUsuarioEditar, nombres, apellidos, estado, rol, checkCambiarPassword, password, cliente)
    .subscribe((resp: GeneralResponse) => {
      //console.log('RESP: ', resp);
    
      this.mostrarLoading = false;

      if(resp.tieneError){
        this.mostrarLoading = false;
        this.mostrarInfoGeneral = true;
        this.textoOverlay = resp.message;
      }else{

        this.mostrarLoading = false;
        this.mostrarInfoGeneral = false;
        this.textoOverlay = "";
        this.mostrarFormularioPrincipal = false;
        this.mostrarOverlay = false;
        this.mostrarOpcionesPosteriores = true;
        this.textoOpcionesPosterior = "Usuario editado exitosamente";

      }

    }, (err) => {

      console.warn("ERR: ", err);

      this.mostrarOverlay = false;
      this.mostrarLoading = false;
    });
  }


}
