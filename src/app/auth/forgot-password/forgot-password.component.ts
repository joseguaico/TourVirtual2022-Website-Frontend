import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  formForgotPassword: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
  });

  cargando: boolean = false;
  textoError: string = "";

  textoPosterior: string = '';
  mostrarFormulario = false;
  mostrarPanelPostExitoso = false;

 
  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("Recuperar password");
    this.mostrarFormulario = true;
    this.mostrarPanelPostExitoso = false;
  }

  campoNoValido(campo: string){
    return this.formForgotPassword.controls[campo].errors && this.formForgotPassword.controls[campo].touched;
  }

  guardar(){

    if (this.formForgotPassword.invalid){
      return this.formForgotPassword.markAllAsTouched();
    }

    this.cargando = true;
    this.textoError = '';
    this.textoPosterior = '';
    this.formForgotPassword.disable();
    this.accountService.solicitarRecuperarPassword(this.formForgotPassword.get('email')?.value.trim()).subscribe((resp: any) =>  {
  
      console.log('RESP recuperar password: ', resp);

      if (resp.tieneError === false){

        this.textoPosterior = resp.message;
        this.mostrarFormulario = false;
        this.mostrarPanelPostExitoso = true;

          // TODO: Mostrar panel con info post envío de email
       
        this.textoError = '';

       
        //return;
       
      }
      else {
        this.textoError = resp.message;
        this.formForgotPassword.enable();
      }

      this.cargando = false;

    },
    err => {
      this.cargando = false;
        this.textoError = 'Se produjo un error en la comunicación con el servidor';
        this.formForgotPassword.enable();
    });



  }

  redirectToLogin(){
    this.router.navigate(["account/login"]);
  }

}
