import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.css']
})
export class EditarDatosComponent implements OnInit {

  formEditar: FormGroup = this.fb.group({
    nombres: ['', [Validators.required] ],
    apellidos: ['', [Validators.required] ],
    checkCambiarPassword: [false, ],
    password: ['', [] ],
  });

  mostrarDetalle = true;
  mostrarFormularioPrincipal = false;
  mostrarPassword = false;

  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';

  constructor(public fb: FormBuilder, 
    private router: Router, 
    public accountService: AccountService,
    private titleService: Title
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Editar datos de usuario');
    this.setModoInicial();
    this.cargarDatosUsuarioActual();
  }
  
  campoNoValido(campo: string){
    return this.formEditar.controls[campo].errors && this.formEditar.controls[campo].touched;
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

  redirectToEdit(){

    this.setModoInicial();
    this.cargarDatosUsuarioActual();
  }

  cargarDatosUsuarioActual(){
    this.formEditar.get('nombres')?.setValue(this.accountService.usuario?.nombres);
    this.formEditar.get('apellidos')?.setValue(this.accountService.usuario?.apellidos);
    this.formEditar.get('checkCambiarPassword')?.setValue(false);
  }

  setModoInicial(){
    this.formEditar.reset();
    this.formEditar.get('checkCambiarPassword')?.setValue(false);
    this.formEditar.get('password')?.setValue('');
    this.mostrarOverlay = false;
    this.mostrarLoading = false;
    this.mostrarInfoGeneral = false;
    this.textoOverlay = ''; 
    this.mostrarOpcionesPosteriores = false;
    this.textoOpcionesPosterior = '';
    this.mostrarFormularioPrincipal = true;
    this.mostrarPassword = false;
  }


  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  guardar(){
    if (this.formEditar.invalid){
      return this.formEditar.markAllAsTouched();
    }  

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    const {nombres, apellidos, password, checkCambiarPassword } = this.formEditar.value;


    this.accountService.editarUsuarioActual(nombres, apellidos, checkCambiarPassword, password)
    .subscribe((resp: GeneralResponse) => {

      console.log(resp);

      this.mostrarLoading = false;

      if(resp.tieneError){
        this.mostrarLoading = false;
        this.mostrarInfoGeneral = true;
        this.textoOverlay = resp.message;
      }else{

        this.mostrarLoading = false;
        this.mostrarInfoGeneral = false;
        this.textoOverlay = "";
        this.mostrarOverlay = false;
        this.mostrarOpcionesPosteriores = true;
        this.mostrarFormularioPrincipal = false;
        this.textoOpcionesPosterior = "Datos de usuario editados exitosamente";
      }

    }, (err) => {

      console.warn("ERR: ", err);

      this.mostrarOverlay = false;
      this.mostrarLoading = false;
    });


  }

}
