import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaUsuariosComponent } from './busqueda-usuarios/busqueda-usuarios.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaUsuariosComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  {
    path: 'crear-usuario', component: CrearUsuarioComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class UsuariosRoutingModule { }
