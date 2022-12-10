import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class HotspotsService {

  constructor(private http: HttpClient) { }

  crearHotspot(imagen360: string, descripcion: string, ath: string, atv: string, sceneTo: string) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('Imagen360', imagen360);
    formData.append('Descripcion', '');
    formData.append('Ath', ath);
    formData.append('Atv', atv);
    formData.append('SceneTo', sceneTo);

    return this.http.post<GeneralResponse>(`${baseUrl}/Hotspots/CrearHotspot`, formData)
    .pipe(

      tap((datos: any) => console.log('TAP: ', datos)),

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

  eliminarHotspot(imagen360: string, hotspot: string) : Observable<GeneralResponse>{
    const options = {
      body: {
        Imagen360: imagen360,
        Hotspot: hotspot
      },
    };
    
    return this.http.delete<GeneralResponse>(`${baseUrl}/Hotspots/BorrarHotspot`, options )
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
