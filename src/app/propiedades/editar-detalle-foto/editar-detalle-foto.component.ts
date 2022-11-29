import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoImagen360 } from 'src/app/interfaces/InfoImagen360.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';

@Component({
  selector: 'app-editar-detalle-foto',
  templateUrl: './editar-detalle-foto.component.html',
  styleUrls: ['./editar-detalle-foto.component.css']
})
export class EditarDetalleFotoComponent implements OnInit {

  btnAddHotspotVisible = false;
  btnRemoverHotspotVisible = false;
  btnAjustarVisible = false;
  btnOtraImagenVisible = false;
  btnVolverVisible = false;
  btnCancelarVisible = false;
  btnAceptarVisible = false;
  textoBtnCancelar = 'Cancelar';

  codPropiedad: string = '';
  codImagen: string = '';
  imagen360: InfoImagen360 | null = null;
  mostrarDetalle = false;
  tituloImagen = '';
  mensajeCarga = '';

  mostrarInfoModo = false;
  textoModo = 'Modo agregar enlace activado';
  textoInfoOpciones = '';
  cssClassTextoInfo = 'blue';

  agregarActivo = false;
  eliminarActivo = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private imagenes360: Imagenes360Service,
    private sanitizer: DomSanitizer,
    ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.codPropiedad = params.propiedad;
      this.codImagen = params.foto;

      if(this.codPropiedad !== undefined && this.codPropiedad !== '' && this.codImagen !== undefined && this.codImagen !== ''){
       this.obtenerInfoFoto360();
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = "El enlace para editar las fotos no es válido.";
      }

    });
  }

  obtenerInfoFoto360(){
    this.imagenes360.obtenerInfoImagen(this.codImagen, this.codPropiedad).subscribe((resp: GeneralResponse) => {
     
      console.log('RESP: ', resp);

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.imagen360 = resp.datos as InfoImagen360;

        this.setOpcionesDefault();
      
        
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });

  }

  setOpcionesDefault(){
    this.btnAddHotspotVisible = true;
    this.btnRemoverHotspotVisible = true;
    this.btnVolverVisible = true;
    this.btnCancelarVisible = false;
    this.btnAceptarVisible = false;
    this.btnOtraImagenVisible = true;
    this.textoModo = '';
    this.mostrarInfoModo = false;
    this.textoBtnCancelar = 'Cancelar';
  }
  setModoEliminarHotspot(){
    this.btnAddHotspotVisible = false;
    this.btnRemoverHotspotVisible = false;
    this.btnOtraImagenVisible = false;
    this.btnVolverVisible = false;

    this.btnCancelarVisible = true;
    this.btnAceptarVisible = false;

    this.textoBtnCancelar = 'Finalizar';

    this.textoModo = 'Modo borrar enlace activado'; // TODO: Cambiar estilo .removeClass("blue").addClass("red");    
    this.cssClassTextoInfo = 'red';
    this.textoInfoOpciones = 'Haga click sobre el enlace que desea eliminar';
    this.mostrarInfoModo = true;

  }

  mostrarBoton(boton: ElementRef, mostrar: boolean){
    boton!.nativeElement.style.display = mostrar ? '' : 'none';
  }

  btnAgregarHotspotClick(){

  }
  btnRemoverHotspotClick(){
    if (this.eliminarActivo === false) {
      //TODO: REVIOSAR resetInfoAlert();
      this.setModoEliminarHotspot();
  }

  }
  btnAjustarClick(){

  }
  btnOtraImagenClick(){
    
  }
  btnVolverClick(){
    //this.router.navigate([".."]);
    this.router.navigate(['propiedades/editar-fotos'],  { queryParams: { cod: this.codPropiedad} })
  }
  btnCancelarClick(){
    if (this.agregarActivo == true) {
      //krpano.call("removehotspot(" + hotspotTempAdd.Name + ")");
      //hotspotTempAdd = null;
      this.agregarActivo = false;
  }
  if (this.eliminarActivo == true) {
      this.eliminarActivo = false;
  }
    this.setOpcionesDefault();
  }
  btnAceptarClick(){
    
  }
  



}
