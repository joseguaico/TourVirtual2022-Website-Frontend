import { Injectable } from '@angular/core';
import { EstadoUsuario } from '../interfaces/estadoUsuario.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadosUsuarioService {

  estadosUsuario: EstadoUsuario[] = [
    { id: 1, descripcion: 'Activo' },
    { id: 2, descripcion: 'Bloqueado' },
  ];

  constructor() { }

  public obtenerEstadosUsuario() : EstadoUsuario[] {
    return this.estadosUsuario;
  }  
}
