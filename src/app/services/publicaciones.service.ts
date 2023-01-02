import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  constructor(private httpClient: HttpClient) {}

  obtenerPublicacion<Publicacion>(codigoPublicacion: string){

   // const codigoBase64 = atob(codigoPublicacion.trim());

    return this.httpClient.get(`${baseUrl}/Publicaciones/public/GetInfo?code=${codigoPublicacion}`)
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


  agregarVisita<GeneralResponse>(codigoPublicacion: string){

    var formData = new FormData();
    formData.append('code', codigoPublicacion);

    // const codigoBase64 = atob(codigoPublicacion.trim());
 
     return this.httpClient.post(`${baseUrl}/Publicaciones/public/AgregarVisita`, formData)
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
