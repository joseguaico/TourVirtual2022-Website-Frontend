import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BusquedaPropiedadesComponent } from './busqueda-propiedades/busqueda-propiedades.component';
import { BasePropiedadesComponent } from './base-propiedades/base-propiedades.component';
import { PropiedadesRoutingModule } from './propiedades-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearPropiedadComponent } from './crear-propiedad/crear-propiedad.component';
import { EditarFotosComponent } from './editar-fotos/editar-fotos.component';


@NgModule({
  declarations: [
    BusquedaPropiedadesComponent,
    BasePropiedadesComponent,
    CrearPropiedadComponent,
    EditarFotosComponent
  ],
  imports: [
    CommonModule,
    PropiedadesRoutingModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PropiedadesModule { }
