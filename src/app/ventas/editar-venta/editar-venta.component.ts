import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoServicio } from 'src/app/interfaces/tipoServicio.interfaces';
import { Venta } from 'src/app/interfaces/venta.interface';
import { TiposServicioService } from 'src/app/services/tipos-servicio.service';
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-editar-venta',
  templateUrl: './editar-venta.component.html',
  styleUrls: ['./editar-venta.component.css']
})
export class EditarVentaComponent implements OnInit {

  public tiposServicio: TipoServicio[] = [];

  formEditar: FormGroup = this.fb.group({
    cantidadPropiedades: ['', [Validators.required] ],
    cantidadFotos: ['', [Validators.required] ],
    tipoServicio: ['', [Validators.required] ],
    montoVenta: ['', [Validators.required] ],
    comentario: ['', [] ],
    checkEditarComprobante: [false, ],
    comprobante: [null, [] ],
  });

  codVentaEditar: string = '';
  ventaEditar: Venta | null = null;
  mostrarDetalle: boolean = true;
  mostrarFormularioPrincipal: boolean = true;
  mostrarInputFoto = false;
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
    private tiposServicioService: TiposServicioService,
    private ventasService: VentasService,
    private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle('Editar venta');

    this.tiposServicio = this.tiposServicioService.obtenerTiposServicio();

    this.activatedRoute.queryParams.subscribe((params:any) => {
      console.log(params); 
      this.codVentaEditar = params.cod;
      console.log(this.codVentaEditar); // 

      if(this.codVentaEditar !== undefined && this.codVentaEditar !== ''){
        this.obtenerInfoVenta();
      }else{
        this.mostrarDetalle = false;
        this.mostrarFormularioPrincipal = false;
        this.mensajeCarga = "El enlace para editar venta no es válido.";
      }

    });
  }
  
  obtenerInfoVenta(){
    
  }


  campoNoValido(campo: string){
    return this.formEditar.controls[campo].errors && this.formEditar.controls[campo].touched;
  }

  cargarDatosEditar(){
    this.formEditar.get('cantidadPropiedades')?.setValue(this.ventaEditar!.propiedades);
    this.formEditar.get('cantidadFotos')?.setValue(this.ventaEditar!.fotos);
    this.formEditar.get('tipoServicio')?.setValue(this.ventaEditar!.tipoServicio);
    this.formEditar.get('montoVenta')?.setValue(this.ventaEditar!.monto);
    this.formEditar.get('comentario')?.setValue(this.ventaEditar!.comentario);
  }

  guardar(){
    if (this.formEditar.invalid){
      return this.formEditar.markAllAsTouched();
    }    

    console.log(this.formEditar.value);


    const {nombre, email, nombreContacto, telefonosContacto, direccion} = this.formEditar.value;

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    // this.clientesService.editarCliente(this.clienteEditar!.idx, nombre.trim(), email.trim(), nombreContacto.trim(), telefonosContacto.trim(),direccion.trim()
    //   ).subscribe((resp: GeneralResponse) => {
    //     console.log('RESP: ', resp);
      
    //     this.mostrarLoading = false;

    //     if(resp.tieneError){
    //       this.mostrarLoading = false;
    //       this.mostrarInfoGeneral = true;
    //       this.textoOverlay = resp.message;
    //     }else{

    //       this.mostrarLoading = false;
    //       this.mostrarInfoGeneral = false;
    //       this.textoOverlay = "";
    //       this.mostrarFormularioPrincipal = false;
    //       this.mostrarOverlay = false;
    //       this.mostrarOpcionesPosteriores = true;
    //       this.textoOpcionesPosterior = "Cliente editado exitosamente";

    //     }

    //   }, (err) => {

    //     console.warn("ERR: ", err);
    //     this.mostrarOverlay = false;
    //     this.mostrarLoading = false;
    //   })



  }


  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.router.navigate(['ventas/crear-venta']);
  }

  redirectToBusqueda(){
    this.router.navigate(['ventas/busqueda']);
  }


  onCheckEditarComprobanteChanged(event: Event){
    const checked = this.formEditar.get('checkEditarComprobante')?.value;
    this.agregarValidacionFile(checked);
    this.mostrarInputFoto = checked;
   }
   agregarValidacionFile(agregar: boolean){
     if(agregar){
       this.formEditar.get('comprobante')?.clearValidators();
       this.formEditar.get('comprobante')?.setValidators(Validators.required);
     }else{
       this.formEditar.get('comprobante')?.clearValidators();
     }
     this.formEditar.get('comprobante')?.reset();
     this.formEditar.get('comprobante')?.updateValueAndValidity();
   }
 

}
