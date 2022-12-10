import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Hotspot } from 'src/app/interfaces/hotspot.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { HotspotsService } from 'src/app/services/hotspots.service';

declare let $ : any;

@Component({
  selector: 'app-borrar-hotspot-modal',
  templateUrl: './borrar-hotspot-modal.component.html',
  styleUrls: ['./borrar-hotspot-modal.component.css']
})
export class BorrarHotspotModalComponent implements OnInit {

  @ViewChild('mdlBorrarHotspot') mdlBorrarHotspot!: ElementRef;  

  @Output('onHotspotBorrado') onHotspotBorrado: EventEmitter<any> = new EventEmitter();

  textoTitulo = 'Borrar enlace';

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  
  codImagen: string = '';
  codHotspot: string = '';
  mostrarDetalles = false;
  textoEliminacion: string = '';

  mostrarInfoOverlay = false;

  constructor(private hotspotsService: HotspotsService) { }

  ngOnInit(): void {
  }
  
  mostrarModal(codHotspot: string, codImagen: string, tituloSceneTo: string){
    this.reiniciarOverlay();
    this.codHotspot = codHotspot.toLowerCase().startsWith('h') ? codHotspot.substring(1) : codHotspot;
    this.codImagen = codImagen;
    this.mostrarDetalles = true;
    this.textoEliminacion = `¿Está seguro que quiere borrar este enlace, que redirige a la imagen: ${tituloSceneTo} ?`;
    $(this.mdlBorrarHotspot.nativeElement).modal('show');
  }


  cerrarModal(){
    $(this.mdlBorrarHotspot.nativeElement).modal('hide');
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

  borrarHotspot(){
    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    this.hotspotsService.eliminarHotspot(this.codImagen, this.codHotspot).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

     // console.log(resp);

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const hotspotBorrado: Hotspot = resp.datos as Hotspot;
          this.onHotspotBorrado.emit({hotspotBorrado: hotspotBorrado});
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
