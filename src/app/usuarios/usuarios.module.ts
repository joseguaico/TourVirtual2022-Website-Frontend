import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BaseUsuariosComponent } from './base-usuarios/base-usuarios.component';
import { BusquedaUsuariosComponent } from './busqueda-usuarios/busqueda-usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';

import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    BaseUsuariosComponent,
    BusquedaUsuariosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    HttpClientModule,
    RouterModule,
    SharedModule
  ]
})
export class UsuariosModule { }
