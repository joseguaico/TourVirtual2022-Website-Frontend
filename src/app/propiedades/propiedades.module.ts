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
import { InfoPropiedadModalComponent } from './components/info-propiedad-modal/info-propiedad-modal.component';
import { AgregarFotoModalComponent } from './components/agregar-foto-modal/agregar-foto-modal.component';
import { EditarFotoModalComponent } from './components/editar-foto-modal/editar-foto-modal.component';
import { BorrarFotoModalComponent } from './components/borrar-foto-modal/borrar-foto-modal.component';
import { EditarDetalleFotoComponent } from './editar-detalle-foto/editar-detalle-foto.component';
import { CambiarFotoModalComponent } from './components/cambiar-foto-modal/cambiar-foto-modal.component';
import { AgregarHotspotModalComponent } from './components/agregar-hotspot-modal/agregar-hotspot-modal.component';
import { BorrarHotspotModalComponent } from './components/borrar-hotspot-modal/borrar-hotspot-modal.component';
import { EditarPropiedadComponent } from './editar-propiedad/editar-propiedad.component';

@NgModule({
  declarations: [
    BusquedaPropiedadesComponent,
    BasePropiedadesComponent,
    CrearPropiedadComponent,
    EditarFotosComponent,
    InfoPropiedadModalComponent,
    AgregarFotoModalComponent,
    EditarFotoModalComponent,
    BorrarFotoModalComponent,
    EditarDetalleFotoComponent,
    CambiarFotoModalComponent,
    AgregarHotspotModalComponent,
    BorrarHotspotModalComponent,
    EditarPropiedadComponent,
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
