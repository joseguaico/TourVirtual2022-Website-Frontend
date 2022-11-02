import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-ventas',
  templateUrl: './busqueda-ventas.component.html',
  styleUrls: ['./busqueda-ventas.component.css']
})
export class BusquedaVentasComponent implements OnInit {

  formBusqueda: FormGroup = this.fb.group({
    cliente: ['',],
    desde: ['',],
    hasta: ['',],
    creadoPor: ['',]
  });


  constructor(public fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  
  crearClick(){
    this.router.navigate(['ventas/crear-venta'])
  }

  buscarClick(){
    // TODO: Agregar service para obtener clientes desde la API.
  }
}
