import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentasService } from 'src/app/services/ventas.service';
import { AlertMensajeComponent } from 'src/app/shared/components/alert-mensaje/alert-mensaje.component';
import { PaginationSizes } from 'src/app/shared/lists/paginationSizes';
import { environment } from 'src/environments/environment';
import { BorrarVentaModalComponent } from '../components/borrar-venta-modal/borrar-venta-modal.component';
import { InfoVentaModalComponent } from '../components/info-venta-modal/info-venta-modal.component';

const baseUrl: string = environment.baseUrl;
const baseSistema = environment.baseSistema;

@Component({
  selector: 'app-busqueda-ventas',
  templateUrl: './busqueda-ventas.component.html',
  styleUrls: ['./busqueda-ventas.component.css']
})
export class BusquedaVentasComponent implements OnInit {

  baseSistemaWeb = baseSistema;

  currentPage: number = 1;
  pageSize: number = 10;
  pagesCount: number = 1;
  paginationSizes: number[] = PaginationSizes;
  showPagination: boolean = false;
  showFirst: boolean = false;
  showPrevious: boolean = false;
  showNext: boolean = false;
  showLast: boolean = false;

  auxClientePrev: string = '';
  auxDesdePrev: string = '';
  auxHastaPrev: string = '';
  auxCreadoPorPrev: string = '';

  formBusqueda: FormGroup = this.fb.group({
    cliente: ['',],
    desde: ['',],
    hasta: ['',],
    creadoPor: ['',]
  });

  formPaginator: FormGroup = this.fb.group({
    ddlPageSize: [this.pageSize]
  });

  ventas: Venta[] = [];

  public cargando = false;
  public textoValidacionFecha = '';
  public textoRespuestaBusqueda = '';

  @ViewChild(InfoVentaModalComponent) modalInfo!: InfoVentaModalComponent;
  @ViewChild(BorrarVentaModalComponent) modalBorrarVenta!: BorrarVentaModalComponent;
  @ViewChild(AlertMensajeComponent) alertMensaje!: AlertMensajeComponent;

  public urlVerFoto = baseUrl + '/Ventas/GetComprobanteVenta?codVenta=';

  constructor(public fb: FormBuilder,
    private router: Router,
    private ventasService: VentasService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("B??squeda de ventas")
    const { cliente, desde, hasta, creadoPor} = this.formBusqueda.value;
    this.realizarBusqueda(cliente, desde, hasta, creadoPor);
  }

  
  crearClick(){
    this.router.navigate(['ventas/crear-venta'])
  }

  buscarClick(){

    if(this.compararFechasBusqueda() === false) return;

    const { cliente, desde, hasta, creadoPor} = this.formBusqueda.value;
    this.realizarBusqueda(cliente, desde, hasta, creadoPor);
  }

  realizarBusqueda(cliente: string, desde: string, hasta: string, creadoPor: string){
    this.cargando = true;

    this.auxClientePrev = cliente;
    this.auxDesdePrev = desde;
    this.auxHastaPrev = hasta;
    this.auxCreadoPorPrev = creadoPor;


    this.ventasService.obtenerVentas(cliente, desde, hasta, creadoPor, this.currentPage, this.pageSize).subscribe((resp: any) => 
    {
      this.ventas = resp.datos;

      this.showFirst = resp.showFirst;
      this.showPrevious = resp.showPrevious;
      this.showNext = resp.showNext;
      this.showLast = resp.showLast;
      this.showPagination = resp.showPagination;
      this.pagesCount = resp.totalPages;
      
      this.cargando = false;
      this.textoRespuestaBusqueda = this.ventas.length === 0 ? 'No se encontraron datos' : '';

    },
    (err: any) => {

      const {message, error} = err.error;
      this.cargando = false;
      this.textoRespuestaBusqueda = message;
      this.ventas = [];
    });
  }

  compararFechasBusqueda() {

    let {desde, hasta} = this.formBusqueda.value;
   
    if (desde === '' || hasta === ''){
      this.textoValidacionFecha = '';
      return true;
    }

    //desde = this.revertDate(desde);
    //hasta = this.revertDate(hasta);
    //let validacionOk = true;

    try {
      const fechaDesde = new Date(desde);
      const fechaHasta = new Date(hasta);

      //console.log('Fecha desde: ', desde, fechaDesde, fechaDesde.getTime())
      //console.log('Fecha hasta: ', hasta, fechaHasta, fechaHasta.getTime())
      //console.log(fechaDesde.getTime() > fechaHasta.getTime())

      if (fechaDesde.getTime() > fechaHasta.getTime()) {
        this.textoValidacionFecha = 'La fecha desde debe ser anterior a la fecha hasta';
        return false;
      } else {
        this.textoValidacionFecha = '';
        return true;
      }
    }
    catch (e) {
      console.log(e);
    }
    return true;
  }

  revertDate(date: string) {
    var ret = '';
    try {
        var dd = date.split("-")[0]
        var mm = date.split("-")[1]
        var yyyy = date.split("-")[2]

        ret = yyyy + "-" + mm + "-" + dd;
    } catch (e) { }
    return ret;
  }

  onDdlPageSizeChange(){
    this.pageSize = this.formPaginator.get('ddlPageSize')?.value;
    this.currentPage = 1;
    this.paginarBusquedaPageSize();
  }

  paginarBusquedaPageSize(){
    this.realizarBusqueda(this.auxClientePrev, this.auxDesdePrev, this.auxHastaPrev, this.auxCreadoPorPrev);
  }
  paginarBusqueda(newPage: number){
    this.currentPage = newPage;
    this.paginarBusquedaPageSize();
  }
  
  
  onClickVerDetalle(codXVenta: string){
    this.modalInfo.realizarBusqueda(codXVenta);
  }

  onClickEditarVenta(codXVenta: string){
    this.router.navigate(['ventas/editar-venta'],  { queryParams: { cod: codXVenta} })
  }

  onClickBorrarVenta(venta: Venta){
    this.modalBorrarVenta.mostrarModal(venta.idx, venta.id, venta.cliente);
  }

  onVentaBorrada(codigoVenta: number, codxVenta: string){
    this.alertMensaje.mostrarAlert(`Venta c??digo "${codigoVenta}" borrada exitosamente.`);
    this.removerVentaDelArray(codxVenta);
    this.paginarBusqueda(1);
  }

  removerVentaDelArray(codxVenta: string){
    this.ventas = this.ventas.filter(f => f.idx.trim().toLowerCase() !== codxVenta.trim().toLowerCase());
  }

}
