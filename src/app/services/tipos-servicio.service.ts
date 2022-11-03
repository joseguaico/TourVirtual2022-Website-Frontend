import { Injectable } from '@angular/core';
import { TipoServicio } from '../interfaces/tipoServicio.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TiposServicioService {

  tiposServicio: TipoServicio[] = [
    { id: 1, descripcion: 'Servicio con fotos' },
    { id: 2, descripcion: 'Servicio sin fotos' },
  ];

  constructor() { }

  public obtenerTiposServicio() : TipoServicio[] {
    return this.tiposServicio;
  }

}
