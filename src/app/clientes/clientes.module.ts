import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusquedaClientesComponent } from './busqueda-clientes/busqueda-clientes.component';
import { ClientesRoutingModule } from './clientes-routing.routing';
import { BaseClientesComponent } from './base-clientes/base-clientes.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BusquedaClientesComponent,
    BaseClientesComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class ClientesModule { }
