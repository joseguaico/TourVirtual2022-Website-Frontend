import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewTourComponent } from './preview-tour/preview-tour.component';
import { BasePreviewComponent } from './base-preview/base-preview.component';
import { PreviewRoutingModule } from './preview-routing.routing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PreviewTourComponent,
    BasePreviewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    PreviewRoutingModule
  ]
})
export class PreviewsModule { }
