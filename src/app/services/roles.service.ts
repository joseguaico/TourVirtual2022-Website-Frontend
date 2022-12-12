import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol } from '../interfaces/rol.interface';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  obtenerRoles(){
    return this.http.get<Rol[]>(`${baseUrl}/Roles/GetAll`);
  }

}
