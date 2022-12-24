import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';
import { ClientesService } from 'src/app/services/clientes.service';
import { InfoClienteModalComponent } from '../components/info-cliente-modal/info-cliente-modal.component';
import { CambiarEstadoClienteModalComponent } from '../components/cambiar-estado-cliente-modal/cambiar-estado-cliente-modal.component';
import { Title } from '@angular/platform-browser';
import { PaginationSizes } from 'src/app/shared/lists/paginationSizes';

@Component({
  selector: 'app-busqueda-clientes',
  templateUrl: './busqueda-clientes.component.html',
  styleUrls: ['./busqueda-clientes.component.css']
})
export class BusquedaClientesComponent implements OnInit {

  currentPage: number = 1;
  pageSize: number = 10;
  pagesCount: number = 1;
  paginationSizes: number[] = PaginationSizes;
  showPagination: boolean = false;
  showFirst: boolean = false;
  showPrevious: boolean = false;
  showNext: boolean = false;
  showLast: boolean = false;

  auxNombresPrev: string = '';
  auxEmailPrev: string = '';

  formBusqueda: FormGroup = this.fb.group({
    nombres: ['',],
    email: ['',]
  });
  
  formPaginator: FormGroup = this.fb.group({
    ddlPageSize: [this.pageSize]
  });

  public clientes: ClienteWithCount[] = [];
  public cargando = false;
  public textoRespuestaBusqueda = '';

  @ViewChild(InfoClienteModalComponent) modalInfo!: InfoClienteModalComponent;
  @ViewChild(CambiarEstadoClienteModalComponent) modalCambiarEstado!: CambiarEstadoClienteModalComponent;

  constructor(public fb: FormBuilder,
    private router: Router,
    private clientesService: ClientesService,
    private titleService: Title) { 
    }
    
  ngOnInit(): void {
    this.titleService.setTitle('Búsqueda de clientes');
    registerLocaleData(es);
    const {nombres, email} = this.formBusqueda.value;
    this.realizarBusqueda(nombres, email);
  }

  crearClick(){
    this.router.navigate(['clientes/crear-cliente'])
  }

  buscarClick(){
    const {nombres, email} = this.formBusqueda.value;
    this.realizarBusqueda(nombres, email);
  }

  realizarBusqueda(nombres: string, email: string){
    this.auxNombresPrev = nombres;
    this.auxEmailPrev = email;

    this.cargando = true;

    this.clientesService.obtenerClientesWithCount(nombres, email, this.currentPage, this.pageSize)
      .subscribe((resp: any) => {
        this.clientes = resp.datos;
        this.showFirst = resp.showFirst;
        this.showPrevious = resp.showPrevious;
        this.showNext = resp.showNext;
        this.showLast = resp.showLast;
        this.showPagination = resp.showPagination;
        this.pagesCount = resp.totalPages;

        this.cargando = false;
        this.textoRespuestaBusqueda = this.clientes.length === 0 ? 'No se encontraron datos' : '';

      },
      (err: any) => {

        const {message, error} = err.error;
        this.cargando = false;
        this.textoRespuestaBusqueda = message;
        this.clientes = [];
      });
  }

  onDdlPageSizeChange(){
    this.pageSize = this.formPaginator.get('ddlPageSize')?.value;
    this.currentPage = 1;
    this.paginarBusquedaPageSize();
  }

  paginarBusquedaPageSize(){
    this.realizarBusqueda(this.auxNombresPrev, this.auxEmailPrev);
  }
  paginarBusqueda(newPage: number){
    this.currentPage = newPage;
    this.paginarBusquedaPageSize();
  }



  onClickVerDetalle(codXCliente: string){
    //console.log(codXCliente);
    this.modalInfo.realizarBusqueda(codXCliente);
  }

  cambiarEstado(codXCliente: string){
    this.modalCambiarEstado.obtenerDatosCliente(codXCliente);
  }

  editar(cliente: ClienteWithCount){
    this.router.navigate(['clientes/editar-cliente'],  { queryParams: { cod: cliente.idx} })
  }

  eliminar(){

  }

  onRecargarBusquedaClientes(){
    this.paginarBusqueda(1);
  }

}
