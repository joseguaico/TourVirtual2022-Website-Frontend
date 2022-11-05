import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-busqueda-propiedades',
  templateUrl: './busqueda-propiedades.component.html',
  styleUrls: ['./busqueda-propiedades.component.css']
})
export class BusquedaPropiedadesComponent implements OnInit {

  mostrarPanelAdmin = true;
  propiedades: PropiedadTitulo[] = [];
  private pageNumber: number = 1;
  private pageSize: number = 10;
  public cargando = false;
  public textoRespuestaBusqueda = '';

  formBusquedaAdm: FormGroup = this.fb.group({
    cliente: ['',],
    titulo: ['',],
    conFotos: [true,]
  });

  formBusquedaProp: FormGroup = this.fb.group({
    titulo: ['',],
    conFotos: [true,]
  });


  constructor(public fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {

    this.mostrarPanelAdmin = this.usuarioService.rol === 'ADMINISTRADOR';

    this.preBusqueda();
  }

  crearClick(){
    this.router.navigate(['propiedades/crear-propiedad'])
  }

  buscarClick(){
    this.preBusqueda();
  }

  preBusqueda(){

    if(this.usuarioService.rol === 'ADMINISTRADOR'){

      const {cliente, titulo, conFotos} = this.formBusquedaAdm.value;

      console.log(this.formBusquedaAdm.value);

      this.realizarBusqueda(cliente, titulo, conFotos);

    }else if (this.usuarioService.rol === 'CORREDOR'){
      const {titulo, conFotos} = this.formBusquedaProp.value;

      this.realizarBusqueda('', titulo, conFotos);

    }
  }

  realizarBusqueda(cliente: string, titulo: string, conFotos: boolean){

    this.cargando = true;
    this.propiedadesService.obtenerPropiedadesTitulo(cliente, titulo, conFotos, this.pageNumber, this.pageSize)
      .subscribe(({datos}: any) => 
      {
        this.propiedades = datos;
        this.cargando = false;
        this.textoRespuestaBusqueda = this.propiedades.length === 0 ? 'No se encontraron datos' : '';
  
        console.log('DATOS RESP: ', datos);

      },
      (err: any) => {
  
        const {message, error} = err.error;
        this.cargando = false;
        this.textoRespuestaBusqueda = message;
        this.propiedades = [];
      });

  }



}
