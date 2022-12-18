import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BaseUsuariosComponent } from './base-usuarios/base-usuarios.component';
import { BusquedaUsuariosComponent } from './busqueda-usuarios/busqueda-usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { InfoUsuarioModalComponent } from './components/info-usuario-modal/info-usuario-modal.component';
import { BorrarUsuarioModalComponent } from './components/borrar-usuario-modal/borrar-usuario-modal.component';

@NgModule({
  declarations: [
    BaseUsuariosComponent,
    BusquedaUsuariosComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    InfoUsuarioModalComponent,
    BorrarUsuarioModalComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
