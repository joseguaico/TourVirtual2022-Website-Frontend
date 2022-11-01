import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BusquedaPropiedadesComponent } from './busqueda-propiedades/busqueda-propiedades.component';
import { BasePropiedadesComponent } from './base-propiedades/base-propiedades.component';
import { PropiedadesRoutingModule } from './propiedades-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    BusquedaPropiedadesComponent,
    BasePropiedadesComponent
  ],
  imports: [
    CommonModule,
    PropiedadesRoutingModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ]
})
export class PropiedadesModule { }
