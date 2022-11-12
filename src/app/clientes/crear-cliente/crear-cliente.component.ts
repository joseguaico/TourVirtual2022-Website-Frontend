import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent {

  formCrear: FormGroup = this.fb.group({
    nombre: ['', [Validators.required] ],
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    nombreContacto: ['', [Validators.required] ],
    telefonosContacto: ['', [Validators.required] ],
  });

  mostrarFormularioPrincipal = false;
  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = true;
  textoOpcionesPosterior = '';

  constructor(public fb: FormBuilder,
    private router: Router, 
    public accountService: AccountService) { 
    }

  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  guardar(){
    if (this.formCrear.invalid){
      return this.formCrear.markAllAsTouched();
    }    

    console.log(this.formCrear.value);

    this.setModoInicial();

    console.log(this.formCrear.value);
  }

  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.setModoInicial();    
  }

  redirectToBusqueda(){
    this.router.navigate(['clientes/busqueda']);
  }

  redirectoTo360Images(){
    // TODO: Agregar redirección a pantalla de imágenes 
  }

  setModoInicial(){
    this.formCrear.reset();
    this.mostrarOverlay = false;
    this.mostrarLoading = false;
    this.mostrarInfoGeneral = false;
    this.textoOverlay = ''; 
    this.mostrarOpcionesPosteriores = false;
    this.textoOpcionesPosterior = '';
    this.mostrarFormularioPrincipal = true;
  }

}
