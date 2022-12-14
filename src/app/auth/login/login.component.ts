import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /*
  formularioLogin: FormGroup = this.formBuilder.group({
    email: ['joseguaico@gmail.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['jose2022', [Validators.required] ]
  });*/

  formularioLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['', [Validators.required] ]
  });

  cargando: boolean = false;
  ingresando: boolean = false;
  textoError: string = "";

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private titleService: Title) { }

    ngOnInit(): void {
      this.titleService.setTitle("Iniciar sesión");
    }


    campoNoValido(campo: string){
      return this.formularioLogin.controls[campo].errors && this.formularioLogin.controls[campo].touched;
    }
  
    guardar(){

      if (this.formularioLogin.invalid){
        return this.formularioLogin.markAllAsTouched();
      }
  
      let formData: any = new FormData();
      formData.append('email', this.formularioLogin.controls['email'].value.trim());
      formData.append('password', this.formularioLogin.controls['password'].value.trim());
  
      this.cargando = true;
      this.textoError = '';
      this.formularioLogin.disable();
      this.accountService.login(formData).subscribe((resp: any) =>  {
  
        //console.log('RESP Login: ', resp);
  
        if (resp.tieneError === false){
  
          this.ingresando = true;
          this.textoError = '';

          this.router.navigate(['home']);
          //return;
         
        }
        else {
          //Swal.fire({ title: 'Login', text: resp.message, icon: 'error'});
          this.textoError = resp.message;
          this.formularioLogin.enable();
        }
  
        this.cargando = false;
  
      },
      err => {
        //console.warn('Error:', err)
        this.cargando = false;
          //Swal.fire({ title: 'Login', text: err.message, icon: 'error'});
          //this.textoError = err.message;
          this.textoError = 'Se produjo un error en la comunicación con el servidor';
          this.formularioLogin.enable();
      });
  
    }

    redirectToForgotPassword(){
      this.router.navigate(["auth/forgot-password"]);
    }

}
