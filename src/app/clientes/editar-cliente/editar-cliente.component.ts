import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit {

  formEditar: FormGroup = this.fb.group({
    nombre: ['', [Validators.required] ],
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    nombreContacto: ['', [Validators.required] ],
    telefonosContacto: ['', [Validators.required] ],
    direccion: ['', [Validators.required] ],
  });

  codClienteEditar: string = '';
  clienteEditar: Cliente | null = null;
  mostrarDetalle: boolean = true;
  mostrarFormularioPrincipal: boolean = true;
  mensajeCarga: string = '';

  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';

  constructor(public fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params:any) => {
        console.log(params); 
        this.codClienteEditar = params.cod;
        console.log(this.codClienteEditar); // 

        if(this.codClienteEditar !== undefined && this.codClienteEditar !== ''){
          this.obtenerInfoCliente();
        }

      }
    );
  }

  obtenerInfoCliente(){
    
    this.clientesService.obtenerInfoCliente(this.codClienteEditar.trim()).subscribe((resp: GeneralResponse) => {
     
      console.log('RESP: ', resp);

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.clienteEditar = resp.datos as Cliente;
        this.cargarDatosEditar();
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        this.mostrarFormularioPrincipal = false;
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });

  }

  campoNoValido(campo: string){
    return this.formEditar.controls[campo].errors && this.formEditar.controls[campo].touched;
  }

  cargarDatosEditar(){
    this.formEditar.get('nombre')?.setValue(this.clienteEditar!.nombre);
    this.formEditar.get('email')?.setValue(this.clienteEditar!.email);
    this.formEditar.get('nombreContacto')?.setValue(this.clienteEditar!.nombreContacto);
    this.formEditar.get('telefonosContacto')?.setValue(this.clienteEditar!.telefonosContacto);
    this.formEditar.get('direccion')?.setValue(this.clienteEditar!.direccion);
  }

  guardar(){
    if (this.formEditar.invalid){
      return this.formEditar.markAllAsTouched();
    }    

    console.log(this.formEditar.value);


    const {nombre, email, nombreContacto, telefonosContacto, direccion} = this.formEditar.value;

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    this.clientesService.editarCliente(this.clienteEditar!.idx, nombre.trim(), email.trim(), nombreContacto.trim(), telefonosContacto.trim(),direccion.trim()
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
          this.textoOpcionesPosterior = "Cliente editado exitosamente";

        }

      }, (err) => {

        console.warn("ERR: ", err);
        this.mostrarOverlay = false;
        this.mostrarLoading = false;
      })



  }


  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.router.navigate(['clientes/crear-cliente']);
  }

  redirectToBusqueda(){
    this.router.navigate(['clientes/busqueda']);
  }

  redirectoTo360Images(){
    // TODO: Agregar redirección a pantalla de imágenes 
  }



}
