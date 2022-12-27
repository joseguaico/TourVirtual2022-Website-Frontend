import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordMatchValidation'
})
export class PasswordMatchValidationPipe implements PipeTransform {

  transform(value: any): string {
    if (value === null){
      return '';
    }
    if (value.required !== undefined){
      return 'Campo obligatorio';
    }
    if (value.passwordNotMatched !== undefined){
      return 'Las contraseñas deben ser iguales';
    }
    return '';
  }
}
