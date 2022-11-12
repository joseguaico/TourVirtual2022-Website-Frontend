import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputValidationEmailPipe } from './pipes/input-validation-email.pipe';
import { RouterModule } from '@angular/router';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { MenubarComponent } from './menubar/menubar.component';

@NgModule({
  declarations: [
    InputValidationEmailPipe,
    DigitOnlyDirective,
    MenubarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    InputValidationEmailPipe,
    DigitOnlyDirective,
    MenubarComponent
  ]
})
export class SharedModule { }
