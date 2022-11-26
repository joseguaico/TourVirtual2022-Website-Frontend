import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescargaImagensPropiedad } from '../interfaces/descargaImagenesPropiedad.interface';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class Imagenes360Service {

  constructor(private http: HttpClient) { }

  obtenerImagenesPorPropiedad(codxPropiedad: string) : Observable<GeneralResponse>{
    const params = new HttpParams()
      .set('codPropiedad', codxPropiedad);

    return this.http.get<DescargaImagensPropiedad>(`${baseUrl}/FotosPropiedades/GetFotos`, { params })
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

  obtenerThumbnail(codx: string){
    return this.http.get(`${baseUrl}/FotosPropiedades/bkt/GetThumbnail/${codx}`, { responseType: 'blob' });
  }

  guardarImagen360(codxPropiedad: string, titulo: string, foto360: File) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('codPropiedad', codxPropiedad);
    formData.append('titulo', titulo.trim());
    formData.append('imagen360', foto360);

    console.log(formData);

    return this.http.post<GeneralResponse>(`${baseUrl}/FotosPropiedades/bkt/GuardarFoto360`, formData)
    .pipe(

      tap((data: any) => console.log('TAP: ', data)),

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
