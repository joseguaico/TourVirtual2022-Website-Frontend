import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';
import { Comuna } from 'src/app/interfaces/comuna.interface';
import { PropiedadInfo } from 'src/app/interfaces/propiedadInfo.interface';
import { Region } from 'src/app/interfaces/region.interface';
import { GeneralResponse } from 'src/app/models/generalResponse.class';
import { AccountService } from 'src/app/services/account.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { RegionesService } from 'src/app/services/regiones.service';

@Component({
  selector: 'app-crear-propiedad',
  templateUrl: './crear-propiedad.component.html',
  styleUrls: ['./crear-propiedad.component.css']
})
export class CrearPropiedadComponent implements OnInit, AfterViewInit {

  regiones: Region[] = [];
  comunas: Comuna[] = [];
  clientes: Cliente[] = [];
  clienteSel: ClienteWithCount | null = null;

  mostrarPanelAdmin = false;
  mostrarPanelCliente = true;
  cupoDisponible: number = 5;
  mostrarInfoCupo = false;
  textoCupo = '';

  formCrear: FormGroup = this.fb.group({
    titulo: ['', [Validators.required] ],
    descripcion: ['', [Validators.required] ],
    direccion: ['', [Validators.required] ],
    habitaciones: ['', [Validators.required] ],
    banos: ['', [Validators.required] ],
    region: ['', [Validators.required] ],
    comuna: ['', [Validators.required] ],
  });

  formCliente: FormGroup = this.fb.group({
    cliente: ['', [Validators.required] ]
  });

  mostrarFormularioPrincipal = true;
  mostrarOverlay = false;
  mostrarLoading = false;
  mostrarInfoGeneral = false;
  textoOverlay = ''; // Acá también registrar mensajes de repuesta desde la API
  mostrarOpcionesPosteriores = false;
  textoOpcionesPosterior = '';

  codPropiedadNueva = '';

  constructor(public fb: FormBuilder, 
    private router: Router,
    private regionesService: RegionesService,
    public accountService: AccountService,
    private clientesService: ClientesService,
    private propiedadesService: PropiedadesService,
    private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle('Crear propiedad');
    
   this.mostrarPanelAdmin = this.accountService.usuario.rol === 'ADMINISTRADOR';
   //this.mostrarPanelCliente = this.accountService.usuario.rol === 'CORREDOR';

   if (this.mostrarPanelAdmin){
    
    this.clientesService.obtenerClientesAll().subscribe(({datos}: any) => {
      this.clientes = datos;
      this.formCliente.get('cliente')?.setValue("");
    });

   }else{
    this.obtenerInfoClienteFromTK();
  
   }
   
  }

  ngAfterViewInit(): void {
    this.regionesService.obtenerRegiones().subscribe(({datos}: any) => {
      this.regiones = datos;
      this.reiniciarComunas();
    }, (err) => {
      this.reiniciarComunas();
    });

  }

  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  campoNoValidoCliente(campo: string){
    return this.formCliente.controls[campo].errors && this.formCliente.controls[campo].touched;
  }

  onRegionChange(){

    const region = this.formCrear.get('region')?.value;

    if(region !== ""){
      this.cargarComunas(region);
    }else{
      this.reiniciarComunas();
    }
  }

  onClienteChange() {
  const codCliente = this.formCliente.get('cliente')?.value;

  if(codCliente !== ""){
    this.obtenerInfoCliente(codCliente);
  }else{
    this.clienteSel = null;
    this.mostrarInfoCupo = false;
  }

  }

  cargarComunas(region: number){  
    this.regionesService.obtenerComunasPorRegion(region).subscribe(({datos}: any) => {
      this.comunas = datos;
      this.formCrear.get('comuna')?.setValue("");
    })
  }

  reiniciarComunas(){
    this.comunas = [];
      this.formCrear.get('comuna')?.setValue("");
  }

  guardar(){
    
    let camposRequeridosOk = true;

    if(this.mostrarPanelAdmin){
      if (this.formCliente.invalid){
        camposRequeridosOk = false;
        this.formCliente.markAllAsTouched();      
      } 
    }
    
    if (this.formCrear.invalid){
      camposRequeridosOk = false;
      this.formCrear.markAllAsTouched();      
    }    

    if (!camposRequeridosOk){
      return;
    }
    

    this.mostrarOverlay = true;
    this.mostrarLoading = true;

    this.enviarDatos().subscribe((resp: GeneralResponse) => {
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
        this.textoOpcionesPosterior = "Propiedad creada exitosamente";
        const {uidx} = resp.datos as PropiedadInfo;
        this.codPropiedadNueva = uidx;

        this.mostrarPanelAdmin = false;
      }

    }, (err) => {
      console.warn("ERR: ", err);
      this.mostrarOverlay = false;
      this.mostrarLoading = false;
    });
   
  }

  obtenerInfoCliente(codCliente: string){
    this.clientesService.obtenerInfoCliente(codCliente).subscribe( ({datos}: any) => {
    
      let cliente = datos as ClienteWithCount;
      this.clienteSel = cliente;
      
      this.cargarInfoCupoCliente();

    }, (err) => {
      this.clienteSel = null;
      this.textoCupo = "";
      this.mostrarInfoCupo = false;
    });
  }

  obtenerInfoClienteFromTK(){
    this.clientesService.obtenerInfoClienteFromToken().subscribe(({datos}: any) => {

      let cliente = datos as ClienteWithCount;
      this.clienteSel = cliente;
      this.cargarInfoCupoCliente();
    })
  }


  cargarInfoCupoCliente(){

    this.cupoDisponible = this.clienteSel!.cupoPropiedades - this.clienteSel!.cantidadPropiedades;

    let textoAux = this.mostrarPanelAdmin ? "Este cliente ha" : "Ha";
    let textoAuxDisp = this.cupoDisponible == 1 ? "propiedad" : "propiedades";

    if (this.cupoDisponible == 0){
      this.textoCupo = `${textoAux} utilizado ${ this.clienteSel!.cupoPropiedades} propiedades. Ha alcanzado el máximo de propiedades contratadas en este servicio.`;
    }else{
      this.textoCupo = `${textoAux} utilizado ${ this.clienteSel!.cantidadPropiedades} propiedades. Puede crear ${ this.cupoDisponible} ${textoAuxDisp} más.`;
    }
    
    this.mostrarInfoCupo = true;
  

  }

  enviarDatos() : Observable<GeneralResponse> {
    if(this.accountService.usuario.rol.toUpperCase() === 'ADMINISTRADOR'){
      return this.enviarDatosAdministrador();
    }
    else{
      return this.enviarDatosCorredor();      
    }
  }

  enviarDatosAdministrador() : Observable<GeneralResponse>{
    const { cliente } = this.formCliente.value;
    const { titulo, descripcion, direccion, habitaciones, banos, region, comuna} = this.formCrear.value;

    return this.propiedadesService.crearPropiedadAdministrador(cliente, titulo, descripcion, direccion, habitaciones, banos, region, comuna);
  }

  enviarDatosCorredor() : Observable<GeneralResponse>{
    const { titulo, descripcion, direccion, habitaciones, banos, region, comuna} = this.formCrear.value;

    return this.propiedadesService.crearPropiedadCorredor(titulo, descripcion, direccion, habitaciones, banos, region, comuna);
  }

  setModoInicial(){
    this.formCrear.reset();
    this.formCrear.get('region')?.setValue('');
    this.formCrear.get('comuna')?.setValue('');
   
    this.mostrarOverlay = false;
    this.mostrarLoading = false;
    this.mostrarInfoGeneral = false;
    this.textoOverlay = ''; 
    this.mostrarOpcionesPosteriores = false;
    this.textoOpcionesPosterior = '';
    this.mostrarFormularioPrincipal = true;
    this.mostrarPanelAdmin = this.accountService.usuario.rol === 'ADMINISTRADOR';

    if (this.accountService.usuario.rol === 'ADMINISTRADOR'){
      this.clienteSel = null;
      this.mostrarInfoCupo = false; 
      this.formCliente.reset(); 
      this.formCliente.get('cliente')?.setValue('');
    }else{
      this.obtenerInfoClienteFromTK();
    }
  }

  redirectToCreate(){
    this.setModoInicial();
  }

  redirectToBusqueda(){
    this.router.navigate(['propiedades/busqueda']);
  }

  redirectToFotos(){
    this.router.navigate(['propiedades/editar-fotos'],  { queryParams: { cod: this.codPropiedadNueva} })
  }
  
  ocultarModal(){
    this.mostrarInfoGeneral = false;
    this.mostrarOverlay = false;
  }
}
