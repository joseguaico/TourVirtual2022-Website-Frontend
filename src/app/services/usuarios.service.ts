import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DescargaUsuarios } from '../interfaces/descargaUsuarios.interface';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(email:string, nombre: string, idRol: string, pageNumber: number, pageSize: number){

    const params = new HttpParams()
    .set('email', email)
    .set('nombre', nombre)
    .set('rol', idRol)
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

    return this.http.get<DescargaUsuarios>(`${baseUrl}/usuarios/GetAllPaged`, { params });

  }

  
}
