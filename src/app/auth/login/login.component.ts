import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formularioLogin: FormGroup = this.formBuilder.group({
    email: ['joseguaico@gmail.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['jose2022', [Validators.required] ]
  });

  cargando: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router) { }

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
      this.usuarioService.login(formData).subscribe((resp: any) =>  {
  
        //console.log('RESP Login: ', resp);
  
        if (resp.error === false){
  
          this.router.navigateByUrl('/');
          return;
         
        }
        else {
          Swal.fire({ title: 'Login', text: resp.message, icon: 'error'});
        }
  
        this.cargando = false;
  
      },
      err => {
        console.warn('Error_ :', err)
        this.cargando = false;
          Swal.fire({ title: 'Login', text: err.message, icon: 'error'});
      });
  
    }

}
