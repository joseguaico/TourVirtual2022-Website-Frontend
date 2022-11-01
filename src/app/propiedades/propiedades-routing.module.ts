import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaPropiedadesComponent } from './busqueda-propiedades/busqueda-propiedades.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaPropiedadesComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PropiedadesRoutingModule { }
