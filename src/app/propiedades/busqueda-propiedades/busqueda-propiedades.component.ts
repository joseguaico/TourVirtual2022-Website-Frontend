import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-propiedades',
  templateUrl: './busqueda-propiedades.component.html',
  styleUrls: ['./busqueda-propiedades.component.css']
})
export class BusquedaPropiedadesComponent implements OnInit {

  mostrarPanelAdmin = true;

  formBusquedaAdm: FormGroup = this.fb.group({
    nombres: ['',],
    email: ['',]
  });

  formBusquedaProp: FormGroup = this.fb.group({
    nombres: ['',],
    email: ['',]
  });


  constructor(public fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  crearClick(){
    this.router.navigate(['propiedades/crear-propiedad'])
  }

  buscarClick(){
    // TODO: Agregar service para obtener clientes desde la API.
  }

}
