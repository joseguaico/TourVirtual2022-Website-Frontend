import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BaseAccountComponent } from './base-account/base-account.component';
import { EditarDatosComponent } from './editar-datos/editar-datos.component';
import { AccountRoutingModule } from './account-routing.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BaseAccountComponent,
    EditarDatosComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
