import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaPropiedadesComponent } from './busqueda-propiedades/busqueda-propiedades.component';
import { CrearPropiedadComponent } from './crear-propiedad/crear-propiedad.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaPropiedadesComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  {
    path: 'crear-propiedad', component: CrearPropiedadComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PropiedadesRoutingModule { }
