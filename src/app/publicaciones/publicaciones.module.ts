import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePublicacionesComponent } from './base-publicaciones/base-publicaciones.component';
import { VerPublicacionComponent } from './ver-publicacion/ver-publicacion.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PublicacionesRoutingModule } from './publicaciones.routing';

@NgModule({
  declarations: [
    BasePublicacionesComponent,
    VerPublicacionComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    PublicacionesRoutingModule
  ]
})
export class PublicacionesModule { }
