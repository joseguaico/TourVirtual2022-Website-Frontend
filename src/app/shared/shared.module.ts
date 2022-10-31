import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { InputValidationEmailPipe } from './pipes/input-validation-email.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    InputValidationEmailPipe,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    InputValidationEmailPipe,
    HeaderComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
