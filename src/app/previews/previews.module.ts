import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewTourComponent } from './preview-tour/preview-tour.component';
import { BasePreviewComponent } from './base-preview/base-preview.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PreviewsRoutingModule } from './previews.routing';

@NgModule({
  declarations: [
    PreviewTourComponent,
    BasePreviewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    PreviewsRoutingModule
  ]
})
export class PreviewsModule { }
