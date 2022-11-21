import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Region } from '../interfaces/region.interface';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class RegionesService {

  constructor(private http: HttpClient) { }

  obtenerRegiones(){
    return this.http.get<Region[]>(`${baseUrl}/Regiones/GetRegionesAll`);
  }

  obtenerComunasPorRegion(codRegion: number){

    const params = new HttpParams()
    .set('region', codRegion)

    return this.http.get(`${baseUrl}/Regiones/GetComunasPorRegion`, { params });
  }

}
