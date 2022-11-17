import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Venta } from 'src/app/interfaces/venta.interface';
import { VentasService } from 'src/app/services/ventas.service';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl;

@Component({
  selector: 'app-busqueda-ventas',
  templateUrl: './busqueda-ventas.component.html',
  styleUrls: ['./busqueda-ventas.component.css']
})
export class BusquedaVentasComponent implements OnInit {

  formBusqueda: FormGroup = this.fb.group({
    cliente: ['',],
    desde: ['',],
    hasta: ['',],
    creadoPor: ['',]
  });

  ventas: Venta[] = [];
  private pageNumber: number = 1;
  private pageSize: number = 10;
  public cargando = false;
  public textoValidacionFecha = '';
  public textoRespuestaBusqueda = '';

  public urlVerFoto = baseUrl + '/Ventas/GetComprobanteVenta?codVenta=';

  constructor(public fb: FormBuilder,
    private router: Router,
    private ventasService: VentasService) { }

  ngOnInit(): void {
    this.realizarBusqueda();
  }

  
  crearClick(){
    this.router.navigate(['ventas/crear-venta'])
  }

  buscarClick(){

    if(this.compararFechasBusqueda() === false) return;

    this.realizarBusqueda();
  }

  realizarBusqueda(){

    this.cargando = true;
    const { cliente, desde, hasta, creadoPor} = this.formBusqueda.value;

    this.ventasService.obtenerVentas(cliente, desde, hasta, creadoPor, this.pageNumber, this.pageSize).subscribe(({datos, error}: any) => 
    {
      this.ventas = datos;
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

}
