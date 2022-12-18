import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Venta } from 'src/app/interfaces/venta.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { VentasService } from 'src/app/services/ventas.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-venta-modal',
  templateUrl: './borrar-venta-modal.component.html',
  styleUrls: ['./borrar-venta-modal.component.css']
})
export class BorrarVentaModalComponent implements OnInit {

  @ViewChild('mdlVentaBorrar') mdlVentaBorrar!: ElementRef;

  @Output('onVentaBorrada') onVentaBorrada: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Confirmar eliminación de venta';
  contenidoPublicar = '';

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codigoVenta = -1;
  codxVenta = '';
  nombreCliente = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private ventasService: VentasService) { }

  ngOnInit(): void {
  }

   
  mostrarModal(codxVenta: string, codigoVenta: number, nombreCliente: string){
    this.reiniciarOverlay();
    this.codxVenta = codxVenta;
    this.codigoVenta = codigoVenta;
    this.nombreCliente = nombreCliente;
    this.mostrarDetalles = true;

    $(this.mdlVentaBorrar.nativeElement).modal('show');
  }

  cerrarModal(){
    $(this.mdlVentaBorrar.nativeElement).modal('hide');
    this.reiniciarOverlay();
  }
  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  cerrarModalOverlay(){
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    this.cerrarModal();
  }

  enviarBorrarVenta(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.ventasService.eliminarVenta(this.codxVenta).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const ventaBorrada: Venta = resp.datos as Venta;
          this.onVentaBorrada.emit({codigoVenta: ventaBorrada.id, codxVenta: ventaBorrada.idx });
          this.cerrarModalAll();
        }
        this.mostrarInfoOverlay = true;
    },
    (err: any) => {
      const {message, error} = err.error;
      this.actualizando = false;
      this.textoPosteriorCambio = message;
      this.mostrarInfoOverlay = true;
      this.mostrarCerrarOverlay = true;
    });
  }

}
