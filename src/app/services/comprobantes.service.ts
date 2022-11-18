import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ComprobantesService {

  constructor(private http: HttpClient) { }

  obtenerComprobanteVenta(codx: string){
    return this.http.get(`${baseUrl}/Ventas/GetComprobanteVenta?codVenta=${codx}`, { responseType: 'blob' });
  }


}
