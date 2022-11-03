import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { InputValidationEmailPipe } from './pipes/input-validation-email.pipe';
import { RouterModule } from '@angular/router';
import { DigitOnlyDirective } from './directives/digit-only.directive';

@NgModule({
  declarations: [
    InputValidationEmailPipe,
    HeaderComponent,
    SidebarComponent,
    DigitOnlyDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    InputValidationEmailPipe,
    HeaderComponent,
    SidebarComponent,
    DigitOnlyDirective
  ]
})
export class SharedModule { }
