import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';

declare let $ : any;

@Component({
  selector: 'app-cambiar-estado-cliente-modal',
  templateUrl: './cambiar-estado-cliente-modal.component.html',
  styleUrls: ['./cambiar-estado-cliente-modal.component.css']
})
export class CambiarEstadoClienteModalComponent implements OnInit {

  @Output('recargarBusqueda') recargarBusquedaEmmiter: EventEmitter<any> = new EventEmitter();

  @ViewChild('mdlCambiarEstado') mdlCambiarEstado!: ElementRef;
  cargando = false;
  textoTitulo = '';
  mostrarDetalles = true;
  mostrarMensaje = false;
  mensaje = '';
  cliente: ClienteWithCount | null = null;
  textoCambio1 = '';
  textoCambio2 = '';
  mostrarOverlay = false;
  actualizando = false;
  mostrarInfoCambioEstado = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;


  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $(this.mdlCambiarEstado.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.mostrarMensaje = false;
    this.mensaje = "";
    this.cliente = null;

    this.reiniciarOverlay();
  }

  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }


  public obtenerDatosCliente(codigoX: string){

    this.reiniciarOverlay();

    this.cargando = true;
    this.mostrarDetalles = false;
    $(this.mdlCambiarEstado.nativeElement).modal('show');

    this.clientesService.obtenerInfoCliente(codigoX).subscribe((resp: GeneralResponse) => 
    {
      this.cargando = false;

        if(resp.tieneError){
          this.mensaje = resp.message;
        }else{
          this.mensaje = "";
          this.cliente = resp.datos as ClienteWithCount;
          
          console.log(this.cliente);
          
          if (this.cliente.estado.toLowerCase() !== 'vigente'){
            this.textoTitulo = 'Cambiar a estado vigente';
            this.textoCambio1 = `El estado del cliente ${this.cliente.nombre}, código ${this.cliente.id}, cambiará a vigente.`; 
            this.textoCambio2 = `Podrá ingresar al sistema y sus poblicaciones serán visibles para todos.`;

          }else{
            this.textoTitulo = 'Cambiar a estado bloqueado';
            this.textoCambio1 = `El cliente ${this.cliente.nombre}, código ${this.cliente.id}, será suspendido.`; 
            this.textoCambio2 = `Ya no podrá usar el sistema y sus publicaciones no serán visibles.`;

          }
          
          this.mostrarDetalles = true;
          
        }

    },
    (err: any) => {
      const {message, error} = err.error;
      this.cargando = false;
      this.mostrarDetalles = false
      this.mensaje = message;
    });
  }

  cambiarEstado(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    const nuevoEstado = this.cliente?.estado.toLowerCase() === 'vigente'? true : false;


    this.clientesService.cambiarEstadoCliente(this.cliente!.idx, nuevoEstado).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

      console.log(resp);

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarAll = true;

          this.recargarBusquedaEmmiter.emit();

        }
        this.mostrarInfoCambioEstado = true;
    },
    (err: any) => {
      const {message, error} = err.error;
      this.actualizando = false;
      this.textoPosteriorCambio = message;
      this.mostrarInfoCambioEstado = true;
      this.mostrarCerrarOverlay = true;
    });

  }

  cerrarModalOverlay(){
    //console.log('cerrarModalOverlay...')
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    //console.log('cerrarModalAll...')
    this.cerrarModal();
  }

}
