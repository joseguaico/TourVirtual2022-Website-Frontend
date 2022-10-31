import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputValidationEmail'
})
export class InputValidationEmailPipe implements PipeTransform {

  transform(value: any): string {
    if (value === null){
      return '';
    }
    if (value.required !== undefined){
      return 'Campo obligatorio';
    }
    if (value.pattern !== undefined){
      return 'Email no válido';
    }
    return '';
  }
}
