import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { InputValidationEmailPipe } from './pipes/input-validation-email.pipe';
import { RouterModule } from '@angular/router';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { MenubarComponent } from './menubar/menubar.component';

@NgModule({
  declarations: [
    InputValidationEmailPipe,
    HeaderComponent,
    SidebarComponent,
    DigitOnlyDirective,
    MenubarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    InputValidationEmailPipe,
    HeaderComponent,
    SidebarComponent,
    DigitOnlyDirective,
    MenubarComponent
  ]
})
export class SharedModule { }
