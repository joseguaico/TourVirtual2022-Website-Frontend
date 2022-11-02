import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaClientesComponent } from './busqueda-clientes/busqueda-clientes.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaClientesComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  { path: 'crear-cliente', component: CrearClienteComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ClientesRoutingModule { }
