import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';

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
    direccion: ['', [Validators.required] ],
  });

  mostrarFormularioPrincipal = true;
  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';

  constructor(public fb: FormBuilder,
    private router: Router, 
    private clientesService: ClientesService) { 
    }

  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  guardar(){
    if (this.formCrear.invalid){
      return this.formCrear.markAllAsTouched();
    }    

    console.log(this.formCrear.value);

    const {nombre, email, nombreContacto, telefonosContacto, direccion} = this.formCrear.value;

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    this.clientesService.crearCliente(nombre.trim(), email.trim(), nombreContacto.trim(), telefonosContacto.trim(),direccion.trim()
      ).subscribe((resp: GeneralResponse) => {
        console.log('RESP: ', resp);
      
        this.mostrarLoading = false;

        if(resp.tieneError){
          this.mostrarLoading = false;
          this.mostrarInfoGeneral = true;
          this.textoOverlay = resp.message;
        }else{

          this.mostrarLoading = false;
          this.mostrarInfoGeneral = false;
          this.textoOverlay = "";
          this.mostrarFormularioPrincipal = false;
          this.mostrarOverlay = false;
          this.mostrarOpcionesPosteriores = true;
          this.textoOpcionesPosterior = "Cliente creado exitosamente";

        }

      }, (err) => {

        //const esErrorApi = err.error.error;
        //const textoErrorApi = err.error.message;
        //const erroresValidacionApi = err.error.errors;

        console.warn("ERR: ", err);
        //console.log("ES ERROR API: ", esErrorApi);
        //console.log("TEXTO ERROR API: ", textoErrorApi);
        //console.log("ERRORES VALIDACION API: ", erroresValidacionApi);

        this.mostrarOverlay = false;
        this.mostrarLoading = false;
      })

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
