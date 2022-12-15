import { Component, OnInit } from '@angular/core';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';

@Component({
  selector: 'app-editar-propiedad',
  templateUrl: './editar-propiedad.component.html',
  styleUrls: ['./editar-propiedad.component.css']
})
export class EditarPropiedadComponent implements OnInit {

  mostrarDetalle = true;
  propiedadEditar: PropiedadInfo | null = null;


  constructor() { }

  ngOnInit(): void {
  }

}
