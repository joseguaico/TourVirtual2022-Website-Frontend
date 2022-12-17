import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable, tap, toArray } from 'rxjs';
import { Comuna } from 'src/app/interfaces/comuna.interface';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';
import { PropiedadInfoEditar } from 'src/app/interfaces/propiedadInfoEditar.interface';
import { Region } from 'src/app/interfaces/region.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { AccountService } from 'src/app/services/account.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { RegionesService } from 'src/app/services/regiones.service';

@Component({
  selector: 'app-editar-propiedad',
  templateUrl: './editar-propiedad.component.html',
  styleUrls: ['./editar-propiedad.component.css']
})
export class EditarPropiedadComponent implements OnInit {

  cargando = true;
  codPropiedadEditar: string = '';
  codRegionAux: number = 0;
  mensajeCarga: string = '';

  mostrarDetalle = true;
  propiedadEditar: PropiedadInfoEditar | null = null;
  
  regiones: Region[] = [];
  comunas: Comuna[] = [];

  mostrarPanelAdmin = false;
  mostrarPanelCliente = true;
  cupoDisponible: number = 5;
  mostrarInfoCupo = false;
  textoCupo = '';

  formEditar: FormGroup = this.fb.group({
    titulo: ['', [Validators.required] ],
    descripcion: ['', [Validators.required] ],
    direccion: ['', [Validators.required] ],
    habitaciones: ['', [Validators.required] ],
    banos: ['', [Validators.required] ],
    region: ['', [Validators.required] ],
    comuna: ['', [Validators.required] ],
  });

  mostrarFormularioPrincipal = true;
  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';
  mostrarMensajeCarga = false;

  constructor(public fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private regionesService: RegionesService,
    public accountService: AccountService,
    private propiedadesService: PropiedadesService,
    private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle("Editar propiedad");

    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.codPropiedadEditar = params.cod;

      this.cargando = true;

      if(this.codPropiedadEditar !== undefined && this.codPropiedadEditar !== '' ){
        this.mostrarDetalle = true;      
        //-->this.setModoInicial();
        this.mostrarFormularioPrincipal = false;
        this.prepararDatos();
        this.mostrarMensajeCarga = false;
      }else{
        this.cargando = false;
        this.mostrarDetalle = false;
        this.mensajeCarga = "El enlace para editar la propiedad no es válido.";
        this.mostrarMensajeCarga = true;
      }
    });
  }
  
  campoNoValido(campo: string){
    return this.formEditar.controls[campo].errors && this.formEditar.controls[campo].touched;
  }

  onRegionChange(){

    const region = this.formEditar.get('region')?.value;

    if(region !== ""){
      this.cargarComunas(region);
    }else{
      this.reiniciarComunas();
    }
  }

  cargarComunas(region: number){  
    this.obtenerComunas(region).subscribe(({datos}: any) => {
      this.comunas = datos;
      this.formEditar.get('comuna')?.setValue("");
    })
  }

  reiniciarComunas(){
    this.comunas = [];
      this.formEditar.get('comuna')?.setValue("");
  }
  
  prepararDatos(){

    this.cargando = true;

    concat(this.obtenerRegiones(), this.obtenerInfoPropiedad()) 
      .pipe(
        toArray()
      )   
      .subscribe((resp: any) => {
        //console.log('Posterior: ', resp);

        this.obtenerComunas(this.codRegionAux).subscribe((resp: any) => {
          this.cargarPropiedadEnFormulario();
        })
       
        
      }, (err) => {
        console.error(err);
        // TODO: Agregar mensaje de error desde api...
      });
  }


  obtenerInfoPropiedad() : Observable<any>{
    //console.log('obtenerInfoPropiedad()');
    return this.propiedadesService.obtenerInfoPropiedadEditar(this.codPropiedadEditar)
      .pipe(
        tap((resp: any) => {
          //console.log('Info Propiedad TAP: ', resp.datos as PropiedadInfo);
          this.propiedadEditar = resp.datos as PropiedadInfoEditar;
          this.codRegionAux = this.propiedadEditar?.codRegion;
        }),
      );
  }
  obtenerRegiones(): Observable<Region[]>{
    //console.log('obtenerRegiones()');
    return this.regionesService.obtenerRegiones()
    .pipe(
      tap((resp: any) => {
        //console.log('Regiones TAP: ', resp.datos as Region[]);
        this.regiones = resp.datos as Region[];
      })
    );;
  }
  obtenerComunas(region: number): Observable<any>{
    return this.regionesService.obtenerComunasPorRegion(region)
    .pipe(
      tap((resp: any) => {
        //console.log('Comunas TAP: ', resp.datos as Comuna[]);
        this.comunas = resp.datos as Comuna[];
      })
    );;
  }

  cargarPropiedadEnFormulario(){

    if(this.propiedadEditar !== null){

      this.formEditar.get('titulo')?.setValue(this.propiedadEditar!.titulo);
      this.formEditar.get('descripcion')?.setValue(this.propiedadEditar!.descripcion);
      this.formEditar.get('direccion')?.setValue(this.propiedadEditar!.direccion);
      this.formEditar.get('habitaciones')?.setValue(this.propiedadEditar!.habitaciones);
      this.formEditar.get('banos')?.setValue(this.propiedadEditar!.habitaciones);
      this.formEditar.get('region')?.setValue(this.propiedadEditar!.codRegion.toString());
      this.formEditar.get('comuna')?.setValue(this.propiedadEditar!.codComuna.toString());

      this.mostrarFormularioPrincipal = true;
      this.cargando = false;
    }
  }

  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }

  redirectToCreate(){
    this.router.navigate(['propiedades/crear-propiedad']);
  }

  redirectToBusqueda(){
    this.router.navigate(['propiedades/busqueda']);
  }

   guardar(){
    if (this.formEditar.invalid){
      return this.formEditar.markAllAsTouched();      
    }    

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    const { titulo, descripcion, direccion, habitaciones, banos, region, comuna} = this.formEditar.value;

    this.propiedadesService.editarPropiedad(this.propiedadEditar!.codigo, titulo, descripcion, direccion, habitaciones, banos, region, comuna)
    .subscribe((resp: GeneralResponse) => {
      //console.log('RESP: ', resp);
    
      this.mostrarLoading = false;

      if(resp.tieneError){
        this.mostrarLoading = false;
        this.mostrarInfoGeneral = true;
        this.textoOverlay = resp.message;
      }else{

        this.mostrarLoading = false;
        this.mostrarInfoGeneral = false;
        this.textoOverlay = "";
        this.mostrarFormularioPrincipal = false;
        this.mostrarOverlay = false;
        this.mostrarOpcionesPosteriores = true;
        this.mostrarDetalle = false;
        this.textoOpcionesPosterior = "Propiedad editada exitosamente";

      }

    }, (err) => {

      console.warn("ERR: ", err);

      this.mostrarOverlay = false;
      this.mostrarLoading = false;
    });
   
  }


}
