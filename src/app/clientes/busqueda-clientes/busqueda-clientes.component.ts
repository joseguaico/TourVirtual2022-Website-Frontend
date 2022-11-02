import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-clientes',
  templateUrl: './busqueda-clientes.component.html',
  styleUrls: ['./busqueda-clientes.component.css']
})
export class BusquedaClientesComponent implements OnInit {

  formBusqueda: FormGroup = this.fb.group({
    nombres: ['',],
    email: ['',]
  });

  constructor(public fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  crearClick(){
    this.router.navigate(['clientes/crear-cliente'])
  }

  buscarClick(){
    // TODO: Agregar service para obtener clientes desde la API.
  }

}
