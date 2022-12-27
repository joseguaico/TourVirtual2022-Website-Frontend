import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { ClientesService } from 'src/app/services/clientes.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-cliente-modal',
  templateUrl: './borrar-cliente-modal.component.html',
  styleUrls: ['./borrar-cliente-modal.component.css']
})
export class BorrarClienteModalComponent implements OnInit {

  @ViewChild('mdlClienteBorrar') mdlClienteBorrar!: ElementRef;

  @Output('onClienteBorrado') onClienteBorrado: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Confirmar eliminación de cliente';

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codxCliente = '';
  nombreCliente = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
  }

   
  mostrarModal(codxCliente: string, nombreCliente: string){
    this.reiniciarOverlay();
    this.codxCliente = codxCliente;
    this.nombreCliente = nombreCliente;
    this.mostrarDetalles = true;

    $(this.mdlClienteBorrar.nativeElement).modal('show');
  }

  cerrarModal(){
    $(this.mdlClienteBorrar.nativeElement).modal('hide');
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

  enviarBorrarCliente(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.clientesService.eliminarCliente(this.codxCliente).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          const clienteBorrado: Cliente = resp.datos as Cliente;
          this.onClienteBorrado.emit({codxCliente: clienteBorrado.idx, nombreCliente: clienteBorrado.nombre });
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
