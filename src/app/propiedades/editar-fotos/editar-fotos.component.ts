import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, mergeMap } from 'rxjs';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { AlertMensajeComponent } from 'src/app/shared/components/alert-mensaje/alert-mensaje.component';
import { AgregarFotoModalComponent } from '../components/agregar-foto-modal/agregar-foto-modal.component';
import { BorrarFotoModalComponent } from '../components/borrar-foto-modal/borrar-foto-modal.component';
import { EditarFotoModalComponent } from '../components/editar-foto-modal/editar-foto-modal.component';
import { InfoPropiedadModalComponent } from '../components/info-propiedad-modal/info-propiedad-modal.component';

@Component({
  selector: 'app-editar-fotos',
  templateUrl: './editar-fotos.component.html',
  styleUrls: ['./editar-fotos.component.css'],
})
export class EditarFotosComponent implements OnInit {

  cargando = true;

  mostrarDetalle: boolean = true;
  mensajeCarga: string = '';
  propiedad: PropiedadTitulo | null = null;
  codPropiedad: string = '';
  cupoFotos: number = 0;
  usoFotos: number = 0;
  imagenes: Imagen360 [] = [];

  @ViewChild(InfoPropiedadModalComponent) modalInfo!: InfoPropiedadModalComponent;
  @ViewChild(AgregarFotoModalComponent) modallAddFoto!: AgregarFotoModalComponent;
  @ViewChild(AlertMensajeComponent) alertMensaje!: AlertMensajeComponent;
  @ViewChild(EditarFotoModalComponent) modalEditarFoto!: EditarFotoModalComponent;
  @ViewChild(BorrarFotoModalComponent) modalBorrarFoto!: BorrarFotoModalComponent;


  constructor(private propiedadesService: PropiedadesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imagenes360Service: Imagenes360Service,
    private sanitizer: DomSanitizer,
    private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle('Editar fotos por propiedad');


    this.activatedRoute.queryParams.subscribe((params:any) => {
      //console.log(params); 
      this.codPropiedad = params.cod;
      //console.log(this.codPropiedad); // 

      if(this.codPropiedad !== undefined && this.codPropiedad !== ''){
        this.cargando = true;
        this.obtenerInfoPropiedad(true);
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = "El enlace para editar las fotos no es válido.";
      }

    });
  }

  obtenerInfoPropiedad(descargarFotos: boolean){

    this.propiedadesService.obtenerInfoPropiedad(this.codPropiedad.trim()).subscribe((resp: GeneralResponse) => {
     
      //console.log('RESP: ', resp);

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.propiedad = resp.datos as PropiedadTitulo;
        
        if(descargarFotos){
          this.obtenerImagenes360();
        }
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });

  }

  obtenerImagenes360(){
    this.imagenes360Service.obtenerImagenesPorPropiedad(this.codPropiedad).subscribe((resp: any) => {

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.imagenes = resp.datos.imagenes as Imagen360[];
        this.prepareImages(this.imagenes);


        this.usoFotos = resp.datos.usoFotos;
        this.cupoFotos = resp.datos.cupoFotos;
        this.cargando = false;
        
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        this.cargando = false;
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });
  }

  obtenerThumbnail(idxImagen: string){
    this.imagenes360Service.obtenerThumbnail(idxImagen).subscribe((blob: any) => {
    //console.log("CONTENIDO",  blob);
    }, (err: any) => {
      console.warn(err);
    });
  }

  CreateImageFromBlob(image: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      } else {
        reject();
      }
    });
  }

  prepareImages(posts: Imagen360[]) {
    forkJoin(
      posts.map(post =>
         this.imagenes360Service.obtenerThumbnail(post.id).pipe(
          mergeMap(async (response: Blob) => {
            post.imageSrc = await this.CreateImageFromBlob(response);
            return post;
          }))
      )
    ).subscribe((posts: Imagen360[]) => {
      this.imagenes = [...posts];
    });
  }

  prepareImagenPostUpdate(imagenEditar: Imagen360) {
    //forkJoin(
         this.imagenes360Service.obtenerThumbnail(imagenEditar.id).pipe(
          mergeMap(async (response: Blob) => {
            imagenEditar.imageSrc = await this.CreateImageFromBlob(response);
            return imagenEditar
          }
        )
     // )
    ).subscribe((img: Imagen360) => {
      imagenEditar = img;
    });
  }



  onClickVerDetalle(codXPropiedad: string){
    this.modalInfo.realizarBusqueda(codXPropiedad);
  }

  onClickAgregarFoto(codXPropiedad: string){
    //console.log(codXPropiedad);
    this.modallAddFoto.mostrarModal(codXPropiedad);
  }

  onClickEditarFoto(codXFoto: string, titulo: string){
    this.modalEditarFoto.mostrarModal(codXFoto, titulo, this.codPropiedad);
  }

  onClickBorrarFoto(codXFoto: string, titulo: string){
    this.modalBorrarFoto.mostrarModal(codXFoto, titulo, this.codPropiedad);
  }

  onclickDetalleFoto(codxFoto: string, titulo: string){
    this.router.navigate(['propiedades/editar-detalle-foto'],  { queryParams: { foto: codxFoto, propiedad: this.codPropiedad} })
  }

  onClickPreviewTour(){
    //this.router.navigate(['propiedades/preview-tour'],  { queryParams: { propiedad: this.codPropiedad} })
    const codigoBase64 =  btoa(this.codPropiedad.trim());
    const host: string =  location.origin;
    const url: string = host + String(this.router.createUrlTree([`preview/preview-tour/${codigoBase64}`],  { }));

    console.log('URL: ', url);

    console.log(url);
    window.open(url, '_blank');

  }


  onPostCrearFoto(mensaje: string){
    this.alertMensaje.mostrarAlert(mensaje);
    this.obtenerInfoPropiedad(true);
  }

  onPostEditarFoto(mensaje: string, idFoto:string, titulo:string, edicionArchivoFoto: boolean){
    this.alertMensaje.mostrarAlert(mensaje);
    this.actualizarImagenEnArray(idFoto, titulo, edicionArchivoFoto);
  
    //this.obtenerImagenes360();
    
  }

  onPostBorrarFoto(mensaje: string, idFoto:string){
    this.alertMensaje.mostrarAlert(mensaje);
    this.removerImagenEnArray(idFoto);
    //this.cargando = true;
    this.obtenerInfoPropiedad(false);
    //this.obtenerImagenes360();
  }


  actualizarImagenEnArray(codImg: string, tituloNuevo: string, descargarArchivo: boolean){
    for(let i=0; i<this.imagenes.length; i++){
      if(this.imagenes[i].id === codImg){
        this.imagenes[i].descripcion = tituloNuevo;

        if (descargarArchivo){
          this.prepareImagenPostUpdate(this.imagenes[i]);
        }
        break;
      }
    }
  }

  removerImagenEnArray(codImg: string){
    this.imagenes = this.imagenes.filter(f => f.id.trim().toLowerCase() !== codImg.trim().toLowerCase());
  }

}
