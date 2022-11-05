import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';
import { ClientesService } from 'src/app/services/clientes.service';

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

  public clientes: ClienteWithCount[] = [];
  private pageNumber: number = 1;
  private pageSize: number = 10;
  public cargando = false;
  public textoRespuestaBusqueda = '';

  constructor(public fb: FormBuilder,
    private router: Router,
    private clientesService: ClientesService) { 
    }
    
  ngOnInit(): void {
    registerLocaleData(es);
    this.realizarBusqueda();
  }

  crearClick(){
    this.router.navigate(['clientes/crear-cliente'])
  }

  buscarClick(){
    this.realizarBusqueda();
  }

  realizarBusqueda(){
    const {nombres, email} = this.formBusqueda.value;

    this.cargando = true;

    this.clientesService.obtenerClientesWithCount(nombres, email, this.pageNumber, this.pageSize)
      .subscribe(resp => {
        console.log("RESP: ", resp);

        this.clientes = resp.datos;
        this.cargando = false;
      this.textoRespuestaBusqueda = this.clientes.length === 0 ? 'No se encontraron datos' : '';

      },
      (err: any) => {

        const {message, error} = err.error;
        this.cargando = false;
        this.textoRespuestaBusqueda = message;
        this.clientes = [];
      });
  }



  verDetalle(){

  }

  cambiarEstado(){

  }

  editar(){
    this.router.navigate(['clientes/editar-cliente'])
  }

  eliminar(){

  }

}
