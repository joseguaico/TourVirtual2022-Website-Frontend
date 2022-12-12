import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';

declare let $ : any;

@Component({
  selector: 'app-info-cliente-modal',
  templateUrl: './info-cliente-modal.component.html',
  styleUrls: ['./info-cliente-modal.component.css']
})
export class InfoClienteModalComponent implements OnInit {

  @ViewChild('mdlInfoClienteView') mdlInfoClienteView!: ElementRef;
  
  cargando = false;
  textoTitulo = "Detalle del cliente";
  mostrarDetalles = true;
  mostrarMensaje = false;
  mensaje = "";
  cliente: ClienteWithCount | null = null;

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    $(this.mdlInfoClienteView.nativeElement).modal('hide');
    this.mostrarDetalles = false;
    this.mostrarMensaje = false;
    this.mensaje = "";
    this.cliente = null;
  }

  public realizarBusqueda(codigoX: string){

    this.cargando = true;
    this.mostrarDetalles = false;
    $(this.mdlInfoClienteView.nativeElement).modal('show');

    this.clientesService.obtenerInfoCliente(codigoX).subscribe((resp: GeneralResponse) => 
    {
      this.cargando = false;

        if(resp.tieneError){
          this.mensaje = resp.message;
        }else{
          this.mensaje = "";
          this.cliente = resp.datos as ClienteWithCount;
          this.mostrarDetalles = true;
          //console.log(resp);
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
