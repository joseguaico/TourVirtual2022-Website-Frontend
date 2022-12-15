import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescargaPropiedades } from '../interfaces/descargaPropiedades.interface';
import { PropiedadInfo } from '../interfaces/propiedadInfo.interface';
import { PropiedadTitulo } from '../interfaces/propiedadTitulo.interface';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  constructor(private http: HttpClient) { }

  obtenerPropiedadesTitulo(cliente: string, titulo: string, conFotos: boolean, pageNumber: number, pageSize: number){

    const params = new HttpParams()
      .set('cliente', cliente)
      .set('titulo', titulo)
      .set('conFotos', conFotos)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

      return this.http.get<DescargaPropiedades>(`${baseUrl}/Propiedades/GetAllPaged`, { params });
  }

  obtenerPropiedadTitulo(codx: string)  : Observable<GeneralResponse>{
    const params = new HttpParams()
      .set('codPropiedad', codx);

    return this.http.get<PropiedadInfo>(`${baseUrl}/Propiedades/GetInfo`, { params })
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
    );;
  }

  crearPropiedadCorredor(titulo: string, descripcion: string, direccion: string, habitaciones: number, banos: number, region: string, comuna: string){
    var formData = new FormData();
    formData.append('titulo', titulo.trim());
    formData.append('Descripcion', descripcion.trim());
    formData.append('direccion', direccion.trim());
    formData.append('habitaciones', habitaciones.toString());
    formData.append('banos', banos.toString());
    formData.append('region', region.trim());
    formData.append('comuna', comuna.trim());

    return this.http.post<GeneralResponse>(`${baseUrl}/Propiedades/corr/CrearPropiedad`, formData)
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

  crearPropiedadAdministrador(cliente: string, titulo: string, descripcion: string, direccion: string, habitaciones: number, banos: number, region: string, comuna: string){
    var formData = new FormData();
    formData.append('cliente', cliente.trim());
    formData.append('titulo', titulo.trim());
    formData.append('Descripcion', descripcion.trim());
    formData.append('direccion', direccion.trim());
    formData.append('habitaciones', habitaciones.toString());
    formData.append('banos', banos.toString());
    formData.append('region', region.trim());
    formData.append('comuna', comuna.trim());

    return this.http.post<GeneralResponse>(`${baseUrl}/Propiedades/CrearPropiedad`, formData)
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
