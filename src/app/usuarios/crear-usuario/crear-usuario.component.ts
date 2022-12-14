import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { RolesConstantes } from 'src/app/models/constantes';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';
import { RolesService } from 'src/app/services/roles.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  formCrear: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    nombres: ['', [Validators.required] ],
    apellidos: ['', [Validators.required] ],
    password: ['', [Validators.required] ],
    rol: ['', [Validators.required] ],
    cliente: ['', [] ],
  });

  roles: Rol[] = [];
  clientes: Cliente[] = [];
  mostrarCliente = false;

  mostrarFormularioPrincipal = true;
  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';


  constructor(public fb: FormBuilder,
    private router: Router,
    private clientesService: ClientesService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private titleService: Title) { }


  ngOnInit(): void {

    this.titleService.setTitle('Crear usuario');

    this.clientesService.obtenerClientesAll().subscribe((resp: any) => {
      this.clientes = resp.datos as Cliente[];
      this.formCrear.get('cliente')?.setValue('');
    });

    this.rolesService.obtenerRoles().subscribe((resp: any) => {
      this.roles = resp.datos as Rol[];
      this.formCrear.get('rol')?.setValue("");
    });

    this.formCrear.get('rol')?.setValue("");
    this.formCrear.get('cliente')?.setValue("");
  }
  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  onRolChanged(){
    const rolValue = this.formCrear.get('rol')?.value;

    if (rolValue === RolesConstantes.ROL_CORREDOR){
      this.formCrear.get('cliente')?.setValue('');      
      this.formCrear.get('cliente')?.setValidators(Validators.required);
     this.mostrarCliente = true;
    }else{
     this.mostrarCliente = false;
      this.formCrear.get('cliente')?.clearValidators();
    }
    this.formCrear.get('cliente')?.reset();
    this.formCrear.get('cliente')?.updateValueAndValidity();
    this.formCrear.get('cliente')?.setValue('');
  }

  guardar(){
    if (this.formCrear.invalid){
      return this.formCrear.markAllAsTouched();
    }  
   
    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    const {email, nombres, apellidos, password, rol, cliente } = this.formCrear.value;
    
    
    this.usuariosService.crearUsuario(email, nombres, apellidos, password, rol, cliente)
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
        this.textoOpcionesPosterior = "Usuario creado exitosamente";

      }

    }, (err) => {

      console.warn("ERR: ", err);

      this.mostrarOverlay = false;
      this.mostrarLoading = false;
    });


  }

  
  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.setModoInicial();    
  }

  redirectToBusqueda(){
    this.router.navigate(['usuarios/busqueda']);
  }
 
  setModoInicial(){
    this.formCrear.reset();
    this.formCrear.get('cliente')?.setValue('');
    this.formCrear.get('rol')?.setValue('');
    this.mostrarCliente = false;
    this.mostrarOverlay = false;
    this.mostrarLoading = false;
    this.mostrarInfoGeneral = false;
    this.textoOverlay = ''; 
    this.mostrarOpcionesPosteriores = false;
    this.textoOpcionesPosterior = '';
    this.mostrarFormularioPrincipal = true;
  }

}
