import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ComprobantesService } from 'src/app/services/comprobantes.service';

@Component({
  selector: 'app-visor-comprobante',
  templateUrl: './visor-comprobante.component.html',
  styleUrls: ['./visor-comprobante.component.css']
})
export class VisorComprobanteComponent implements OnInit {

  codComprobante: string | null = '';
  contenidoArchivo: any;
  cargando = true;
  mostrarMensaje = false;
  mostrarImagen = false;

  constructor(private comprobantesService: ComprobantesService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private titleService: Title) {}

  ngOnInit(): void {

    this.titleService.setTitle('Ver comprobante de venta');

    this.activatedRoute.paramMap.subscribe((params:ParamMap) => {
      //console.log(params); 
      this.codComprobante = params.get('codigo');
      //console.log(this.codComprobante); // 

      if(this.codComprobante !== null && this.codComprobante !== ''){
      
        this.comprobantesService.obtenerComprobanteVenta(this.codComprobante!).subscribe((blob: Blob) => {
          let objectURL = URL.createObjectURL(blob);
          this.contenidoArchivo = this.sanitizer.bypassSecurityTrustUrl(objectURL);

          console.log("CONTENIDO",  this.contenidoArchivo);

          this.cargando = false;
          this.mostrarMensaje = false;
          this.mostrarImagen = true;
        }, (err: any) => {
          console.warn(err);
          this.cargando = false;
          this.mostrarMensaje = true;
          this.mostrarImagen = false;
        });

      }
    });
  }

}
