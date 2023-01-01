import { NgModule } from '@angular/core';
import { PreviewTourComponent } from './preview-tour/preview-tour.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'preview-tour/:propiedad', component: PreviewTourComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PreviewsRoutingModule { }
