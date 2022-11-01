import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { EditarDatosComponent } from './editar-datos/editar-datos.component';

const routes: Routes = [
  {
    path: 'editar-datos', component: EditarDatosComponent
  },
  {
    path: '', redirectTo: 'editar-datos', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AccountRoutingModule { }
