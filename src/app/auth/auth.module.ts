import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAuthComponent } from './home-auth/home-auth.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth.routing';



@NgModule({
  declarations: [
    HomeAuthComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
