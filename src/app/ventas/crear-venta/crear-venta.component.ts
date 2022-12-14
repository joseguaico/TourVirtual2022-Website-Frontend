import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { TipoServicio } from 'src/app/interfaces/tipoServicio.interfaces';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';
import { TiposServicioService } from 'src/app/services/tipos-servicio.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {

  public clientes: Cliente[] = [];
  public tiposServicio: TipoServicio[] = [];

  mostrarFormularioPrincipal = true;
  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';


  formCrear: FormGroup = this.fb.group({
    cliente: ['', [Validators.required] ],
    cantidadPropiedades: ['', [Validators.required] ],
    cantidadFotos: ['', [Validators.required] ],
    tipoServicio: ['', [Validators.required] ],
    montoVenta: ['', [Validators.required] ],
    comprobante: [null, [Validators.required] ],
  });

  constructor(public fb: FormBuilder, 
    private router: Router, 
    private clientesService: ClientesService,
    private tiposServicioService: TiposServicioService,
    private ventasService: VentasService,
    private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle("Crear venta");

    this.clientesService.obtenerClientesAll().subscribe(({datos}: any) => {
      this.clientes = datos;
    });

    this.tiposServicio = this.tiposServicioService.obtenerTiposServicio();
  }

  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  guardar(){
    if (this.formCrear.invalid){
      return this.formCrear.markAllAsTouched();      
    }    

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    const {cliente, cantidadPropiedades, cantidadFotos, tipoServicio, montoVenta} = this.formCrear.value;
    const comprobante: File = (document.getElementById('fileComprobantePago') as HTMLInputElement).files![0];

    this.ventasService.crearVenta(cliente, cantidadPropiedades, cantidadFotos, tipoServicio, montoVenta, comprobante)
    .subscribe((resp: GeneralResponse) => {
      //console.log('RESP: ', resp);
    
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
        this.textoOpcionesPosterior = "Venta creada exitosamente";

      }

    }, (err) => {

      console.warn("ERR: ", err);

      this.mostrarOverlay = false;
      this.mostrarLoading = false;
    });

  }

  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.setModoInicial();    
  }

  redirectToBusqueda(){
    this.router.navigate(['ventas/busqueda']);
  }
 
  setModoInicial(){
    this.formCrear.reset();
    this.formCrear.get('cliente')?.setValue('');
    this.formCrear.get('tipoServicio')?.setValue('');
    this.formCrear.get('comprobante')?.setValue(null);
    this.mostrarOverlay = false;
    this.mostrarLoading = false;
    this.mostrarInfoGeneral = false;
    this.textoOverlay = ''; 
    this.mostrarOpcionesPosteriores = false;
    this.textoOpcionesPosterior = '';
    this.mostrarFormularioPrincipal = true;
  }

}
