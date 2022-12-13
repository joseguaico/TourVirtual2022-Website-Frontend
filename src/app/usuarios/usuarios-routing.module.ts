import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaUsuariosComponent } from './busqueda-usuarios/busqueda-usuarios.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaUsuariosComponent
  },
  {
    path: '', redirectTo: 'busqueda', pathMatch: 'full'
  },
  {
    path: 'crear-usuario', component: CrearUsuarioComponent
  },
  {
    path: 'editar-usuario', component: EditarUsuarioComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class UsuariosRoutingModule { }
