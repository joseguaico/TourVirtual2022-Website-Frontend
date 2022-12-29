import { Component, OnInit } from '@angular/core';
import { Publicacion } from 'src/app/interfaces/publicacion.interface';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl;

declare let krpanoJS: any;

@Component({
  selector: 'app-preview-tour',
  templateUrl: './preview-tour.component.html',
  styleUrls: ['./preview-tour.component.css']
})
export class PreviewTourComponent implements OnInit {

  public publicacion: Publicacion | null = null;
  public cargando: boolean = true;

  krpano: any = null;
  scenes: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  

}
