import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, mergeMap } from 'rxjs';
import { Imagen360 } from 'src/app/interfaces/imagen360.interface';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { Imagenes360Service } from 'src/app/services/imagenes360.service';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { InfoPropiedadModalComponent } from '../components/info-propiedad-modal/info-propiedad-modal.component';

@Component({
  selector: 'app-editar-fotos',
  templateUrl: './editar-fotos.component.html',
  styleUrls: ['./editar-fotos.component.css'],
})
export class EditarFotosComponent implements OnInit {

  mostrarDetalle: boolean = true;
  mensajeCarga: string = '';
  propiedad: PropiedadTitulo | null = null;
  codPropiedad: string = '';
  cupoFotos: number = 0;
  usoFotos: number = 0;
  imagenes: Imagen360 [] = [];

  @ViewChild(InfoPropiedadModalComponent) modalInfo!: InfoPropiedadModalComponent;


  constructor(private propiedadesService: PropiedadesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imagenes360: Imagenes360Service,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params:any) => {
      console.log(params); 
      this.codPropiedad = params.cod;
      console.log(this.codPropiedad); // 

      if(this.codPropiedad !== undefined && this.codPropiedad !== ''){
        this.obtenerInfoPropiedad();
      }

    }
  );
  }


  obtenerInfoPropiedad(){

    this.propiedadesService.obtenerPropiedadTitulo(this.codPropiedad.trim()).subscribe((resp: GeneralResponse) => {
     
      console.log('RESP: ', resp);

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.propiedad = resp.datos as PropiedadTitulo;
        
        this.obtenerImagenes360();
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });

  }

  obtenerImagenes360(){
    this.imagenes360.obtenerImagenesPorPropiedad(this.codPropiedad).subscribe((resp: any) => {
     
      console.log('RESP: ', resp);

      if(!resp.tieneError){
        this.mostrarDetalle = true;
        this.mensajeCarga = '';

        this.imagenes = resp.datos.imagenes as Imagen360[];
        this.prepareImages(this.imagenes);


        this.usoFotos = resp.datos.usoFotos;
        this.cupoFotos = resp.datos.cupoFotos;
        
      }else{
        this.mostrarDetalle = false;
        this.mensajeCarga = resp.message;
        
      }

    }, (err) => {
      console.warn("ERR: ", err);
    });

  }

  obtenerThumbnail(idxImagen: string){
    this.imagenes360.obtenerThumbnail(idxImagen).subscribe((blob: any) => {
//      console.log("CONTENIDO",  blob);
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
         this.imagenes360.obtenerThumbnail(post.id).pipe(
          mergeMap(async (response: Blob) => {
            post.imageSrc = await this.CreateImageFromBlob(response);
            return post;
          }))
      )
    ).subscribe((posts: Imagen360[]) => {
      this.imagenes = [...posts];
    });
  }

  onClickVerDetalle(codXPropiedad: string){
    this.modalInfo.realizarBusqueda();
  }
}
