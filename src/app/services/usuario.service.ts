import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/loginForm.interface';
import { Menu } from '../interfaces/menu.interface';
import { Usuario } from '../models/model.class';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined;

  constructor(private http: HttpClient,
    private router: Router    
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get refreshToken(): string {
    return localStorage.getItem('refresh-token') || '';
  }

  get uid(): string {
    return this.usuario!.uid || '';
  }

  get rol() : 'CORREDOR' | 'ADMINISTRADOR' {
    return this.usuario!.rol!;
  }

  get headers(){
    return {
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    }
  }
  
  guardarLocalStorage(token: string, refreshToken: string, menu: Menu[]){
    localStorage.setItem('token', token);
    localStorage.setItem('refresh-token', refreshToken);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  login(formData: LoginForm) {
    return this.http.post(`${baseUrl}/account/login`, formData)
      .pipe(
        tap( (resp: any) => {

          if (Object.keys(resp.datos).length !== 0){

            const {uid, email, nombres, apellidos, rol, bloqueado,  menu } = resp.datos;
            const usuario = new Usuario(uid, email, nombres, apellidos, bloqueado, rol.toUpperCase());
    
            this.usuario = usuario;
  
            this.guardarLocalStorage(resp.datos.token, resp.datos.refreshToken, menu);
          }
        })
      );
    }



  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('menu');

    //this.usuario = undefined;

    this.router.navigateByUrl('/auth/login');
  }

  validarToken(){

    //console.log('Headers: ', this.headers);

    const body = {
      'AccessToken': this.token,
      'RefreshToken': this.refreshToken
    };

    console.log(body);

    return this.http.post(`${baseUrl}/account/refreshToken`, body).pipe(

    

      map((resp: any) => {
       
        const {uid, email, nombres, apellidos, rol, bloqueado,  menu } = resp.datos;
        const usuario = new Usuario(uid, email, nombres, apellidos, bloqueado, rol.toUpperCase());

        this.usuario = usuario;
        this.guardarLocalStorage(resp.datos.token, resp.datos.refreshToken, menu);

        return true;
      }),

      catchError((error) => {
       // console.warn('CATCH ERROR Refresh. ', error);
        return of(false)
      })
    );
  }


}
