import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from 'src/app/services/propiedades.service';

@Component({
  selector: 'app-info-propiedad-modal',
  templateUrl: './info-propiedad-modal.component.html',
  styleUrls: ['./info-propiedad-modal.component.css']
})
export class InfoPropiedadModalComponent implements OnInit {

  cargando = true;
  mostrarDetalles = false

  constructor(private http: HttpClient,
    private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {
  }

  cerrarModal(){

  }

  public realizarBusqueda(){
    console.log("Realizar busqueda en modal...")
  }

}
