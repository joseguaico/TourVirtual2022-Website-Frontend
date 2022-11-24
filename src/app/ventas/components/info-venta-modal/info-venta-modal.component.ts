import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentaInfo } from 'src/app/interfaces/ventaInfo.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { VentasService } from 'src/app/services/ventas.service';

declare let $ : any;

@Component({
  selector: 'app-info-venta-modal',
  templateUrl: './info-venta-modal.component.html',
  styleUrls: ['./info-venta-modal.component.css']
})
export class InfoVentaModalComponent implements OnInit {

  @ViewChild('mdlInfoVentaView') mdlInfoVentaView!: ElementRef;

  cargando = false;
  textoTitulo = "Detalle de la venta";
  mostrarDetalles = true;
  mostrarMensaje = false;
  mensaje = "";
  venta: VentaInfo | null = null;

  constructor(private ventasService: VentasService) { }

  ngOnInit(): void {
  }

  
  cerrarModal(){
    $(this.mdlInfoVentaView.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.mostrarMensaje = false;
    this.mensaje = "";
    this.venta = null;
  }

  public realizarBusqueda(codigoX: string){

    this.cargando = true;
    this.mostrarDetalles = false;
    $(this.mdlInfoVentaView.nativeElement).modal('show');

    this.ventasService.obtenerVenta(codigoX).subscribe((resp: GeneralResponse) => 
    {
      this.cargando = false;

        if(resp.tieneError){
          this.mensaje = resp.message;
        }else{
          this.mensaje = "";
          this.venta = resp.datos as VentaInfo;
          this.mostrarDetalles = true;
          console.log(resp);
        }

    },
    (err: any) => {
      const {message, error} = err.error;
      this.cargando = false;
      this.mostrarDetalles = false
      this.mensaje = message;
    });
  }


}
