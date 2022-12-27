import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/cliente.interface';
import { DescargaClientesWithCount } from '../interfaces/descargaClientesWithCount.interface';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  obtenerClientesWithCount(nombre: string, email: string, pageNumber: number, pageSize: number){

    const params = new HttpParams()
      .set('nombre', nombre)
      .set('email', email)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

      return this.http.get<DescargaClientesWithCount>(`${baseUrl}/Clientes/GetWithCountAllPaged`, { params });
  }

  obtenerClientesAll() {
    return this.http.get<Cliente>(`${baseUrl}/Clientes/GetWithCountAllPaged`);
  }

  crearCliente(nombre: string, email: string, nombreContacto: string, telefonos: string, direccion: string) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('nombreContacto', nombreContacto);
    formData.append('telefonosContacto', telefonos);
    formData.append('direccion', direccion);

    return this.http.post<GeneralResponse>(`${baseUrl}/Clientes/CrearCliente`, formData)
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

  obtenerInfoCliente(codx: string) : Observable<GeneralResponse>{
    return this.http.get<Cliente>(`${baseUrl}/Clientes/GetClienteWithCount?codCliente=${codx}`)
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

  obtenerInfoClienteFromToken() : Observable<GeneralResponse>{
    return this.http.get<Cliente>(`${baseUrl}/Clientes/Corr/GetClienteWithCount`)
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

  editarCliente(codx: string, nombre: string, email: string, nombreContacto: string, telefonos: string, direccion: string) : Observable<GeneralResponse> {
    var formData = new FormData();
    formData.append('codigoCliente', codx);
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('nombreContacto', nombreContacto);
    formData.append('telefonosContacto', telefonos);
    formData.append('direccion', direccion);

    return this.http.put<GeneralResponse>(`${baseUrl}/Clientes/UpdateInfoCliente`, formData)
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

  cambiarEstadoCliente(codX: string, bloqueado: boolean){
    var formData = new FormData();
    formData.append('codigoCliente', codX);
    formData.append('bloqueado', bloqueado.toString());

    return this.http.put<GeneralResponse>(`${baseUrl}/Clientes/CambiarEstadoBloqueo`, formData)
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

  eliminarCliente(codxCliente: string) : Observable<GeneralResponse>{
    const options = {
      body: {
        codigoCliente: codxCliente,
      },
    };
    
    return this.http.delete<GeneralResponse>(`${baseUrl}/Clientes/EliminarCliente`, options )
    .pipe(

      //tap((datos: any) => console.log('TAP: ', datos)),

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
