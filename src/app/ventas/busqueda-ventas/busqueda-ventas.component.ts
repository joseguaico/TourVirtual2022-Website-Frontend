import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentasService } from 'src/app/services/ventas.service';

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

  ventas: Venta[] = [];
  private pageNumber: number = 1;
  private pageSize: number = 10;
  public cargando = false;


  constructor(public fb: FormBuilder,
    private router: Router,
    private ventasService: VentasService) { }

  ngOnInit(): void {
    this.realizarBusqueda();
  }

  
  crearClick(){
    this.router.navigate(['ventas/crear-venta'])
  }

  buscarClick(){
    this.realizarBusqueda();
  }

  realizarBusqueda(){

    this.cargando = true;
    const { cliente, desde, hasta, creadoPor} = this.formBusqueda.value;

    this.ventasService.obtenerVentas(cliente, desde, hasta, creadoPor, this.pageNumber, this.pageSize).subscribe(({datos}: any) => 
    {
      console.log('RESP ventas: ', datos);
      this.ventas = datos;
      this.cargando = false;
    },
    err => {
      this.cargando = false;
    });
  }

}
