import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescargaImagensPropiedad } from '../interfaces/descargaImagenesPropiedad.interface';
import { InfoImagen360 } from '../interfaces/InfoImagen360.interface';
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

  guardarImagen360(codxPropiedad: string, titulo: string, foto360: File) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('codPropiedad', codxPropiedad);
    formData.append('titulo', titulo.trim());
    formData.append('imagen360', foto360);
   
    return this.http.post<GeneralResponse>(`${baseUrl}/FotosPropiedades/bkt/GuardarFoto360`, formData)
    .pipe(

      //tap((data: any) => console.log('TAP: ', data)),

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

  editarImagen360AndFoto(codxImagen360: string, codxPropiedad: string, titulo: string, editarFoto: boolean | null, foto360: File | null) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('codImagen', codxImagen360);
    formData.append('codPropiedad', codxPropiedad);
    formData.append('titulo', titulo.trim());

    if (editarFoto === null || editarFoto === false)
    {
      formData.append('EditarArchivoImagen', "false");
      //formData.append('imagen360', foto360);
    }else{
      formData.append('EditarArchivoImagen', "true");
      formData.append('imagen360', foto360!);
    }
    

    return this.http.put<GeneralResponse>(`${baseUrl}/FotosPropiedades/bkt/EditarFoto360`, formData)
    .pipe(

      //tap((data: any) => console.log('TAP: ', data)),

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

  eliminarImagen360(codxPropiedad: string, codxImagen360: string,) : Observable<GeneralResponse>{
    const options = {
      body: {
        propiedad: codxPropiedad,
        imagen360: codxImagen360
      },
    };
    
    return this.http.delete<GeneralResponse>(`${baseUrl}/FotosPropiedades/bkt/BorrarFoto360`, options )
    .pipe(

     // tap((datos: any) => console.log('TAP: ', datos)),

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

  obtenerPreview(codx: string){
    return this.http.get(`${baseUrl}/FotosPropiedades/bkt/GetPreview/${codx}`, { responseType: 'blob' });
  }

  obtenerImagen360(codx: string){
    return this.http.get(`${baseUrl}/FotosPropiedades/bkt/GetImagen360/${codx}`, { responseType: 'blob' });
  }

  obtenerInfoImagen(codxImagen: string, codxPropiedad: string){
    const params = new HttpParams()
      .set('codFoto', codxImagen)
      .set('codPropiedad', codxPropiedad);


    return this.http.get<InfoImagen360>(`${baseUrl}/FotosPropiedades/GetInfoFoto`,{ params })
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
