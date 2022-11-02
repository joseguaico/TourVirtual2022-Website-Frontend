import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusquedaVentasComponent } from './busqueda-ventas/busqueda-ventas.component';
import { CrearVentaComponent } from './crear-venta/crear-venta.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaVentasComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  {
    path: 'crear-venta', component: CrearVentaComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class VentasRoutingModule { }
