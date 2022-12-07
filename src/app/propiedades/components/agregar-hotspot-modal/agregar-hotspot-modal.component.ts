import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';

declare let $ : any;

@Component({
  selector: 'app-agregar-hotspot-modal',
  templateUrl: './agregar-hotspot-modal.component.html',
  styleUrls: ['./agregar-hotspot-modal.component.css']
})
export class AgregarHotspotModalComponent implements OnInit {

  formAddHotspot: FormGroup = this.fb.group({
    screneTo: ['', [] ],
  });

  @ViewChild('mdlAgregarHotspot') mdlAgregarHotspot!: ElementRef;
  textoTitulo = 'Agregar hotspot';

  @Input("imagenes360")imagenes360: Imagen360[] = [];

  mostrarOverlay = false;
  actualizando = false;
  textoPosteriorCambio = '';
  mostrarCerrarOverlay = false;
  mostrarCerrarAll = false;
  codPropiedad: string = '';
  codImagen: string = '';
  mostrarDetalles = false;

  mostrarInfoOverlay = false;

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
  }


  mostrarModal(codXPropiedad: string, codImagen: string){
    this.reiniciarOverlay();
    this.formAddHotspot.reset();
    this.codPropiedad = codXPropiedad;
    this.codImagen = codImagen;
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


  
  guardarHotspot(){

  }


}
