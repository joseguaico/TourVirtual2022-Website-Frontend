import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-crear-nueva-password',
  templateUrl: './crear-nueva-password.component.html',
  styleUrls: ['./crear-nueva-password.component.css']
})
export class CrearNuevaPasswordComponent implements OnInit {

  email = '';
  token = '';

  cargando = false;
  mostrarMensajeCarga = false;
  mostrarFormulario = false;
  mensajeCarga = 'En enlace no es válido';
  mostrarOpcionesNuevoToken = false;

  mostrarOpcionesPostExitoso = false;
  mensajePostExitoso = '';
  
  formularioNuevaPassword: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required] ],
    confirmPassword: ['', [Validators.required] ]
  }, { });

  textoError = '';
  enviando = false;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.cargando = true;
    this.titleService.setTitle('Crear nueva password');

    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.email = params.email;
      this.token = params.token;

      if(this.email !== undefined && this.email !== '' && this.token !== undefined && this.token !== ''){
        this.obtenerInfoSolicitud();
        
      }else{
        this.mostrarFormulario = false;
        this.mensajeCarga = "El enlace para editar las fotos no es válido.";
        this.mostrarMensajeCarga = true;
        this.cargando = false;
      }

    });

  }

  obtenerInfoSolicitud(){

    this.accountService.obtenerInfoSolicitudPassword(this.email.trim(), this.token.trim())
    .subscribe((resp: any) => {

      if(!resp.tieneError){
        this.mostrarFormulario = true;
        this.mensajeCarga = '';

        this.cargando = false;


      }else{
        this.mostrarFormulario = false;
        this.mensajeCarga = resp.message;
        this.mostrarOpcionesNuevoToken = resp.tokenExpirado;
        this.mostrarMensajeCarga = true;
        this.cargando = false;
      }

    });

  }

  toForgotPassword(){
    this.router.navigate(["auth/forgot-password"]);
  }

  toLogin(){
    this.router.navigate(["auth/login"]);
  }

  campoNoValido(campo: string){
    return this.formularioNuevaPassword.controls[campo].errors && this.formularioNuevaPassword.controls[campo].touched;
  }

  campoNoValidoComparison(){
    const confirmPasswordError = this.formularioNuevaPassword.controls['confirmPassword'].errors;

    if (confirmPasswordError !== null && this.formularioNuevaPassword.controls['confirmPassword'].hasError(('required'))) {
      return this.formularioNuevaPassword.controls['confirmPassword'].errors && this.formularioNuevaPassword.controls['confirmPassword'].touched;
    }

    const password = this.formularioNuevaPassword.get('password')?.value;
    const confirmPassword = this.formularioNuevaPassword.get('confirmPassword')?.value;

    if (password !== confirmPassword){
      this.formularioNuevaPassword.controls['confirmPassword'].setErrors({passwordNotMatched: true});
      return true;
    }else{
      this.formularioNuevaPassword.controls['confirmPassword'].setErrors(null);
      return false;
    }
  }

  guardar(){
    
    if (this.formularioNuevaPassword.invalid){
      return this.formularioNuevaPassword.markAllAsTouched();
    }

    this.enviando = true;
    this.textoError = '';
    
    this.formularioNuevaPassword.disable();

    const { password, confirmPassword} = this.formularioNuevaPassword.value;

    this.accountService.crearNuevaPassword(this.email.trim(), password, confirmPassword.trim(), this.token.trim())
    .subscribe((resp: any) =>  {
  
      //console.log('RESP: ', resp);

      // Si no hay error:
      if (resp.tieneError === false){
        this.mostrarFormulario = false; 
        this.mensajeCarga = "";
        this.mostrarMensajeCarga = false;
        this.mostrarOpcionesNuevoToken = false;       

        this.mensajePostExitoso = resp.message;
        this.mostrarOpcionesPostExitoso = true;
       
      }
      else {
        this.textoError = resp.message;

        // Si el token expiró
        if (resp.tokenExpirado === true){
          this.mostrarFormulario = false;        
          this.mensajeCarga = resp.message;
          this.mostrarOpcionesNuevoToken = resp.tokenExpirado;
          this.mostrarMensajeCarga = true;
        }else{
          this.formularioNuevaPassword.enable();
        }
      }

      this.enviando = false;

    },
    err => {
      this.enviando = false;
        this.textoError = 'Se produjo un error en la comunicación con el servidor';
        this.formularioNuevaPassword.enable();
    });




  }

}
