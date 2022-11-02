import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DescargaClientesWithCount } from '../interfaces/descargaClientesWithCount.interface';

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


}
