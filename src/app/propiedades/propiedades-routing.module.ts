import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaPropiedadesComponent } from './busqueda-propiedades/busqueda-propiedades.component';
import { CrearPropiedadComponent } from './crear-propiedad/crear-propiedad.component';
import { EditarFotosComponent } from './editar-fotos/editar-fotos.component';
import { EditarDetalleFotoComponent } from './editar-detalle-foto/editar-detalle-foto.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaPropiedadesComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  {
    path: 'crear-propiedad', component: CrearPropiedadComponent
  },
  {
    path: 'editar-fotos', component: EditarFotosComponent
  },
  {
    path: 'editar-detalle-foto', component: EditarDetalleFotoComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PropiedadesRoutingModule { }
