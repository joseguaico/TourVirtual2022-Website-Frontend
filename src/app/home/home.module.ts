import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';

import { HomeRoutingModule } from './home-routing.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BaseComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    SharedModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
