import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusquedaClientesComponent } from './busqueda-clientes/busqueda-clientes.component';
import { ClientesRoutingModule } from './clientes-routing.routing';
import { BaseClientesComponent } from './base-clientes/base-clientes.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';

@NgModule({
  declarations: [
    BusquedaClientesComponent,
    BaseClientesComponent,
    CrearClienteComponent,
    EditarClienteComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClientesModule { }
