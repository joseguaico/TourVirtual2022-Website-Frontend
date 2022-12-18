import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PropiedadTitulo } from 'src/app/interfaces/propiedadTitulo.interface';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { AccountService } from 'src/app/services/account.service';
import { InfoPropiedadModalComponent } from '../components/info-propiedad-modal/info-propiedad-modal.component';
import { Title } from '@angular/platform-browser';
import { PublicarPropiedadComponent } from '../components/publicar-propiedad/publicar-propiedad.component';
import { AlertMensajeComponent } from 'src/app/shared/components/alert-mensaje/alert-mensaje.component';
import { CancelarPublicacionPropiedadComponent } from '../components/cancelar-publicacion-propiedad/cancelar-publicacion-propiedad.component';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';
import { BorrarPropiedadModalComponent } from '../components/borrar-propiedad-modal/borrar-propiedad-modal.component';

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

  @ViewChild(InfoPropiedadModalComponent) modalInfo!: InfoPropiedadModalComponent;
  @ViewChild(PublicarPropiedadComponent) modalPublicar!: PublicarPropiedadComponent;
  @ViewChild(CancelarPublicacionPropiedadComponent) modalCancelarPropiedad!: CancelarPublicacionPropiedadComponent;
  @ViewChild(BorrarPropiedadModalComponent) modalBorrarPropiedad!: BorrarPropiedadModalComponent;
  @ViewChild(AlertMensajeComponent) alertMensaje!: AlertMensajeComponent;

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
    private accountService: AccountService,
    private propiedadesService: PropiedadesService,
    private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle('Búsqueda de propiedades');

    this.mostrarPanelAdmin = this.accountService.rol === 'ADMINISTRADOR';

    this.preBusqueda();
  }

  crearClick(){
    this.router.navigate(['propiedades/crear-propiedad'])
  }

  buscarClick(){
    this.preBusqueda();
  }

  preBusqueda(){

    if(this.accountService.rol === 'ADMINISTRADOR'){

      const {cliente, titulo, conFotos} = this.formBusquedaAdm.value;

     // console.log(this.formBusquedaAdm.value);

      this.realizarBusqueda(cliente, titulo, conFotos);

    }else if (this.accountService.rol === 'CORREDOR'){
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
  
        //console.log('DATOS RESP: ', datos);

      },
      (err: any) => {
  
        const {message, error} = err.error;
        this.cargando = false;
        this.textoRespuestaBusqueda = message;
        this.propiedades = [];
      });

  }

  editarFoto(codX: string){
    this.router.navigate(['propiedades/editar-fotos'],  { queryParams: { cod: codX} })
  }

  onClickVerDetalle(codXPropiedad: string){
    this.modalInfo.realizarBusqueda(codXPropiedad);
  }

  onClickEditarPropiedad(codxPropiedad: string){
    this.router.navigate(['propiedades/editar-propiedad'],  { queryParams: { cod: codxPropiedad} })
  }

  onClickPublicarPropiedad(codxPropiedad: string, codigoPropiedad: number, tituloPropiedad: string){
    this.modalPublicar.mostrarModal(codxPropiedad, codigoPropiedad, tituloPropiedad);
  }

  onClickCancelarPropiedad(codxPropiedad: string, codigoPropiedad: number, tituloPropiedad: string){
    this.modalCancelarPropiedad.mostrarModal(codxPropiedad, codigoPropiedad, tituloPropiedad);
  }

  onPropiedadPublicada(propiedad: PropiedadInfo){
    this.alertMensaje.mostrarAlert(`Propiedad código ${propiedad.codigo} publicada exitosamente.`);
    this.actualizarPropiedadEnArray(propiedad);
  }

  onClickBorrarPropiedad(propiedad: PropiedadTitulo){
    this.modalBorrarPropiedad.mostrarModal(propiedad.idx, propiedad.id, propiedad.titulo);
  }

  onPropiedadCancelada(propiedad: PropiedadInfo){    
    this.alertMensaje.mostrarAlert(`Propiedad código ${propiedad.codigo} suspendida exitosamente.`);
    this.actualizarPropiedadEnArray(propiedad);
  }

  onPropiedadBorrada(codigoPropiedad: number, codxPropiedad: string){
    this.alertMensaje.mostrarAlert(`Propiedad código ${codigoPropiedad} borrada exitosamente.`);
    this.removerPropiedadDelArray(codxPropiedad);
  }


  actualizarPropiedadEnArray(propiedad: PropiedadInfo){
    for(let i=0; i<this.propiedades.length; i++){
      if(this.propiedades[i].id.toString() === propiedad.codigo){
        this.propiedades[i].codEstado = propiedad.codEstado;
        this.propiedades[i].estado = propiedad.estado;
        this.propiedades[i].vistas = propiedad.visitas
        break;
      }
    }
  }

  removerPropiedadDelArray(codxPropiedad: string){
    this.propiedades = this.propiedades.filter(f => f.idx.trim().toLowerCase() !== codxPropiedad.trim().toLowerCase());
  }

}
