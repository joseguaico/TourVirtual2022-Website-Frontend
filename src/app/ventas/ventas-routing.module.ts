import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusquedaVentasComponent } from './busqueda-ventas/busqueda-ventas.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaVentasComponent
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
export class VentasRoutingModule { }
