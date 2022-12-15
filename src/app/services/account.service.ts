import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/loginForm.interface';
import { GeneralResponse } from '../models/generalResponse.class';
import { UsuarioAccount } from '../models/usuarioAccount.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';
import { StorageService } from './storage.service';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //public usuario: Usuario | undefined;

  private _usuario: UsuarioAccount | undefined;

  public get usuario(){

    return this.storage.getUsuario()!;

  }

  constructor(private http: HttpClient,
    private router: Router,
    private storage: StorageService  
  ) { 
    //console.log("constructor de UsuarioService...");
  }

  get uid(): string {
    return this.usuario!.uid || '';
  }

  get rol() : 'CORREDOR' | 'ADMINISTRADOR' {
    return this.usuario!.rol!;
  }

  get empresa(): string {
    return this.usuario!.empresa!;
  }


  login(formData: LoginForm) {
    return this.http.post(`${baseUrl}/account/login`, formData)
      .pipe(
        tap( (resp: any) => {

          if (Object.keys(resp.datos).length !== 0){
            const { uid, email, nombres, apellidos, rol, bloqueado,  menu, empresa } = resp.datos;
            const usuario = new UsuarioAccount(uid, email, nombres, apellidos, bloqueado, rol.toUpperCase(), empresa);
  
            this.storage.guardarDatos(resp.datos.token, resp.datos.refreshToken, menu, usuario);
          }
        })
      );
    }



  logout(){
    this.storage.limpiarDatos();
    this.router.navigateByUrl('/auth/login');
  }

  refreshToken(){

    const body = {
      'AccessToken': this.storage.getToken(),
      'RefreshToken': this.storage.getRefreshToken()
    };

    //console.log(body);

    return this.http.post(`${baseUrl}/account/refreshToken`, body).pipe(

      map((resp: any) => {
       
       // console.log("RESP Validar token: ", resp);

        const {uid, email, nombres, apellidos, rol, bloqueado,  menu, empresa } = resp.datos;
        const usuario = new UsuarioAccount(uid, email, nombres, apellidos, bloqueado, rol.toUpperCase(), empresa);

        //this.usuario = usuario;
        this.storage.guardarDatos(resp.datos.token, resp.datos.refreshToken, menu, usuario);

        return true;
      }),

      catchError((error) => {
       // console.warn('CATCH ERROR Refresh. ', error);
        return of(false)
      })
    );
  }

  editarUsuarioActual(nombres: string = '', apellidos: string = '', editarPassword: boolean, password: string = '') : Observable<GeneralResponse>{

    var formData = new FormData();    
    formData.append('nombres', nombres);
    formData.append('apellidos', apellidos);
    formData.append('editarPassword', editarPassword.toString());
    formData.append('password', password);

    return this.http.put<GeneralResponse>(`${baseUrl}/Account/EditarDatos`, formData)
    .pipe(
      catchError(err => {
      
        // Si tiene errores de validación de la API 
        const erroresValidacionApi = err.error?.errors;
        
        if (erroresValidacionApi !== null && erroresValidacionApi !== undefined){
          return of(new GeneralResponse(true, erroresApiArrayToString(erroresValidacionApi), {}));
        }

        // Si tiene un error desde las respuesta de API
        if (err.error?.message !== null &&  err.error?.message !== undefined){
          return of(new GeneralResponse(true,  err.error.message, {}));
        }

        // Si se produce otro error
        if (err.message !== null && err.message !== undefined){
          return of(new GeneralResponse(true, err.message, {}));
        }

        return of(err)
      }),

      tap( (resp: any) => {

        if (Object.keys(resp.datos).length !== 0){

          const { uid, email, nombres, apellidos, rol, estado,  empresa } = resp.datos;
          const bloqueado = estado.toLowerCase() === 'bloqueado';
          const usuario = new UsuarioAccount(uid, email, nombres, apellidos, bloqueado, rol.toUpperCase(), empresa);
  
          //this.usuario = usuario;

          this.storage.guardarUsuario(usuario);
        }
      })

    );
  }

}
