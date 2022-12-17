import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'jquery';
import { concat, concatAll, forkJoin, Observable, switchMap, tap, toArray } from 'rxjs';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';
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
  codComunaAux: number = 13;
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

  constructor(public fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private regionesService: RegionesService,
    public accountService: AccountService,
    private clientesService: ClientesService,
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
      
      }else{
        this.cargando = false;
        this.mostrarDetalle = false;
        this.mensajeCarga = "El enlace para editar la propiedad no es válido.";
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

    concat(this.obtenerRegiones(), this.obtenerInfoPropiedad(), this.obtenerComunas(this.codComunaAux)) 
      .pipe(
        toArray()
      )   
      .subscribe((resp: any) => {
        //console.log('Posterior: ', resp);

        this.cargarPropiedadEnFormulario();
        
      }, (err) => {
        console.error(err);
        // TODO: Agregar mensaje de error desde api...
      });
  }


  obtenerInfoPropiedad() : Observable<any>{
    return this.propiedadesService.obtenerInfoPropiedadEditar(this.codPropiedadEditar)
      .pipe(
        tap((resp: any) => {
         // console.log('Info Propiedad TAP: ', resp.datos as PropiedadInfo);
          this.propiedadEditar = resp.datos as PropiedadInfoEditar;
        }),
      );
  }
  obtenerRegiones(): Observable<Region[]>{
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

    console.log('Propiedad Editar', this.propiedadEditar);


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


   guardar(){
    if (this.formEditar.invalid){
      return this.formEditar.markAllAsTouched();      
    }    


    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    // this.enviarDatos().subscribe((resp: GeneralResponse) => {
    //   this.mostrarLoading = false;

    //   if(resp.tieneError){
    //     this.mostrarLoading = false;
    //     this.mostrarInfoGeneral = true;
    //     this.textoOverlay = resp.message;
    //   }else{
    //     this.mostrarLoading = false;
    //     this.mostrarInfoGeneral = false;
    //     this.textoOverlay = "";
    //     this.mostrarFormularioPrincipal = false;
    //     this.mostrarOverlay = false;
    //     this.mostrarOpcionesPosteriores = true;
    //     this.textoOpcionesPosterior = "Propiedad creada exitosamente";
    //     const {codigo} = resp.datos as PropiedadInfo;
    //     this.codPropiedadNueva = codigo;

    //     this.mostrarPanelAdmin = false;
    //   }

    // }, (err) => {
    //   console.warn("ERR: ", err);
    //   this.mostrarOverlay = false;
    //   this.mostrarLoading = false;
    // });
   
  }


}
