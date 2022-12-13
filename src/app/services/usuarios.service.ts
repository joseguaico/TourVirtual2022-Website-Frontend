import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescargaUsuarios } from '../interfaces/descargaUsuarios.interface';
import { UsuarioInfo } from '../interfaces/usuarioInfo.interface';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(email:string, nombre: string, idRol: string, pageNumber: number, pageSize: number){
    const params = new HttpParams()
    .set('email', email)
    .set('nombre', nombre)
    .set('rol', idRol)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);
    return this.http.get<DescargaUsuarios>(`${baseUrl}/usuarios/GetAllPaged`, { params });
  }

  crearUsuario(email: string, nombres: string, apellidos: string, password: string, rol: string, cliente: string) : Observable<GeneralResponse>{

    var formData = new FormData();    
    formData.append('email', email);
    formData.append('nombres', nombres);
    formData.append('apellidos', apellidos);
    formData.append('password', password);
    formData.append('rol', rol);
    formData.append('cliente', cliente);

    return this.http.post<GeneralResponse>(`${baseUrl}/Usuarios/CrearUsuario`, formData)
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
      })

    );
  }
  
  obtenerInfoUsuario(codx: string) : Observable<GeneralResponse>{
    return this.http.get<UsuarioInfo>(`${baseUrl}/Usuarios/GetInfo?codigo=${codx}`)
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
      })
    );
  }

  editarUsuario(codx: string, nombres: string, apellidos: string, estado: string, rol: string, 
    editarPassword: boolean, password: string, cliente: string) : Observable<GeneralResponse>{

    var formData = new FormData();    
    formData.append('usuario', codx);
    formData.append('nombres', nombres);
    formData.append('apellidos', apellidos);
    formData.append('estado', estado);
    formData.append('rol', rol);
    formData.append('editarPassword', editarPassword.toString());
    formData.append('password', password);
    formData.append('cliente', cliente);

    return this.http.put<GeneralResponse>(`${baseUrl}/Usuarios/EditarUsuario`, formData)
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
      })

    );
  }
}
