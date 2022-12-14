import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DescargaVentas } from '../interfaces/descargaVentas.interface';
import { VentaInfo } from '../interfaces/ventaInfo.interface';
import { GeneralResponse } from '../models/generalResponse.class';
import { erroresApiArrayToString } from '../shared/functions/customErrorsFunctions';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient) { }

  obtenerVentas(cliente: string, desde: string, hasta: string, creador: string, pageNumber: number, pageSize: number){

    const params = new HttpParams()
      .set('cliente', cliente)
      .set('desde', desde)
      .set('hasta', hasta)
      .set('creador', creador)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);


    return this.http.get<DescargaVentas>(`${baseUrl}/Ventas/GetAllPaged`, { params });
  }

  crearVenta(cliente: string, propiedades: number, fotos: number, tipoServicio: number, monto: number, comprobante: File) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('cliente', cliente);
    formData.append('cantidadPropiedades', propiedades.toString());
    formData.append('cantidadFotos', fotos.toString());
    formData.append('tipoServicio', tipoServicio.toString());
    formData.append('montoVenta', monto.toString());
    formData.append('comprobanteVenta', comprobante);

    return this.http.post<GeneralResponse>(`${baseUrl}/Ventas/CrearVenta`, formData)
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

  obtenerInfoVenta(codx: string) : Observable<GeneralResponse>{
    return this.http.get<VentaInfo>(`${baseUrl}/Ventas/GetInfoVenta?codVenta=${codx}`)
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

  editarVenta(codxVenta: string, propiedades: number, fotos: number, tipoServicio: number, monto: number, 
    editarComprobante: boolean, comprobante: File | null, comentario: string) : Observable<GeneralResponse>{

    var formData = new FormData();
    formData.append('codigoVenta', codxVenta);
    formData.append('cantidadPropiedades', propiedades.toString());
    formData.append('cantidadFotos', fotos.toString());
    formData.append('tipoServicio', tipoServicio.toString());
    formData.append('montoVenta', monto.toString());
    formData.append('editarComprobante', editarComprobante.toString());
    formData.append('comentario', comentario);

    if (editarComprobante === true){
      formData.append('comprobanteVenta', comprobante!);
    }else{
      formData.append('comprobanteVenta', '');
    }

    return this.http.put<GeneralResponse>(`${baseUrl}/Ventas/EditarVenta`, formData)
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
