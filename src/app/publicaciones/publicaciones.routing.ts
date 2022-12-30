import { NgModule } from '@angular/core';
import { VerPublicacionComponent } from './ver-publicacion/ver-publicacion.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ver-publicacion/:code', component: VerPublicacionComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PublicacionesRoutingModule { }
