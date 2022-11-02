import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaClientesComponent } from './busqueda-clientes/busqueda-clientes.component';
import { CrearClienteComponent } from './crear-cliente/crear-cliente.component';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaClientesComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  { path: 'crear-cliente', component: CrearClienteComponent},
  { path: 'editar-cliente', component: EditarClienteComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ClientesRoutingModule { }
