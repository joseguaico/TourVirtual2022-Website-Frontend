import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Hotspot } from 'src/app/interfaces/hotspot.interface';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { HotspotsService } from 'src/app/services/hotspots.service';

declare let $ : any;

@Component({
  selector: 'app-agregar-hotspot-modal',
  templateUrl: './agregar-hotspot-modal.component.html',
  styleUrls: ['./agregar-hotspot-modal.component.css']
})
export class AgregarHotspotModalComponent implements OnInit {

  formAddHotspot: FormGroup = this.fb.group({
    sceneTo: ['-1', [] ],
  });

  @ViewChild('mdlAgregarHotspot') mdlAgregarHotspot!: ElementRef;
  textoTitulo = 'Agregar hotspot';

  @Input("imagenes360")imagenes360: Imagen360[] = [];

  @Output('onHotspotCreado') onHotspotCreado: EventEmitter<any> = new EventEmitter();

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codPropiedad: string = '';
  
  codImagen: string = '';
  valorAth: string = '';
  valorAtv: string = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;


  constructor(private fb: FormBuilder,
    private hotspotsService: HotspotsService) { }

  ngOnInit(): void {
  }


  mostrarModal(codXPropiedad: string, codImagen: string, valorAth: string, valorAtv: string){
    this.reiniciarOverlay();
    this.formAddHotspot.reset();
    this.formAddHotspot.get('sceneTo')?.setValue('-1');
    this.codPropiedad = codXPropiedad;
    this.codImagen = codImagen;
    this.valorAth = valorAth;
    this.valorAtv = valorAtv;
    this.mostrarDetalles = true;
    $(this.mdlAgregarHotspot.nativeElement).modal('show');
  }


  cerrarModal(){
    $(this.mdlAgregarHotspot.nativeElement).modal('hide');
    this.reiniciarOverlay();
  }
  reiniciarOverlay(){
    this.mostrarOverlay = false;
    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';
  }

  cerrarModalOverlay(){
    //console.log('cerrarModalOverlay...')
    this.mostrarOverlay = false;
  }

  cerrarModalAll(){
    //console.log('cerrarModalAll...')
    this.cerrarModal();
  }

  seleccionValida(){
    return this.formAddHotspot.get('sceneTo')?.value !== '-1';
  }
  
  guardarHotspot(){
    if(this.formAddHotspot.get('sceneTo')?.value === '-1')
    {
      return;
    }

    this.mostrarOverlay = true;
    this.actualizando = true;

    this.mostrarCerrarAll = false;
    this.mostrarCerrarOverlay = false;
    this.textoPosteriorCambio = '';

    const sceneTo = this.formAddHotspot.get('sceneTo')?.value;

    this.hotspotsService.crearHotspot(this.codImagen, '', this.valorAth, this.valorAtv, sceneTo).subscribe((resp: GeneralResponse) => 
    {
      this.actualizando = false;

     // console.log(resp);

        if(resp.tieneError == true){
          this.textoPosteriorCambio = resp.message;
          this.mostrarCerrarOverlay = true;
        }else{
          //this.textoPosteriorCambio = resp.message;
          //this.mostrarCerrarAll = true;

          const hotspotNuevo: Hotspot = resp.datos as Hotspot;
          this.onHotspotCreado.emit({nuevoHotspot: hotspotNuevo});
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
