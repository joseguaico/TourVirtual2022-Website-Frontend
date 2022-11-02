import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BaseVentasComponent } from './base-ventas/base-ventas.component';
import { SharedModule } from '../shared/shared.module';

import { VentasRoutingModule } from './ventas-routing.module';
import { BusquedaVentasComponent } from './busqueda-ventas/busqueda-ventas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearVentaComponent } from './crear-venta/crear-venta.component';

@NgModule({
  declarations: [
    BaseVentasComponent,
    BusquedaVentasComponent,
    CrearVentaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    VentasRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VentasModule { }
