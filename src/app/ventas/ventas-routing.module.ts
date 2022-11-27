import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusquedaVentasComponent } from './busqueda-ventas/busqueda-ventas.component';
import { CrearVentaComponent } from './crear-venta/crear-venta.component';
import { EditarVentaComponent } from './editar-venta/editar-venta.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaVentasComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  {
    path: 'crear-venta', component: CrearVentaComponent
  },
  { 
    path: 'editar-venta', component: EditarVentaComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class VentasRoutingModule { }
