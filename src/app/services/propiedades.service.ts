import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DescargaPropiedades } from '../interfaces/descargaPropiedades.interface';

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

}
