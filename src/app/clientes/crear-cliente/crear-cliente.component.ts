import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

declare function initTemplate():void;
declare function initOffCanvas():void;
declare function initHoverableCollapse():void;

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements AfterViewInit {

  formCrear: FormGroup = this.fb.group({
    nombre: ['', [Validators.required] ],
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    nombreContacto: ['', [Validators.required] ],
    telefonosContacto: ['', [Validators.required] ],
  });

  constructor(public fb: FormBuilder, private router: Router, public usuarioService: UsuarioService) { }

  ngAfterViewInit(): void {
    initTemplate();
  }

  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  guardar(){
    if (this.formCrear.invalid){
      return this.formCrear.markAllAsTouched();
    }    
  }
}
