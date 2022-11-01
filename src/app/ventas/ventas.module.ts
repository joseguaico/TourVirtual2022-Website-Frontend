import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BaseVentasComponent } from './base-ventas/base-ventas.component';
import { SharedModule } from '../shared/shared.module';

import { VentasRoutingModule } from './ventas-routing.module';
import { BusquedaVentasComponent } from './busqueda-ventas/busqueda-ventas.component';

@NgModule({
  declarations: [
    BaseVentasComponent,
    BusquedaVentasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
