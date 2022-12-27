import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { HomeAuthComponent } from './home-auth/home-auth.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CrearNuevaPasswordComponent } from './crear-nueva-password/crear-nueva-password.component';

const routes: Routes = [
  {
    path: 'auth',
    component: HomeAuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'crear-nueva-password', component: CrearNuevaPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
