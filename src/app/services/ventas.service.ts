import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DescargaVentas } from '../interfaces/descargaVentas.interface';

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

  
}
