import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteWithCount } from 'src/app/interfaces/clienteWithCount.interface';
import { Comuna } from 'src/app/interfaces/comuna.interface';
import { Region } from 'src/app/interfaces/region.interface';
import { AccountService } from 'src/app/services/account.service';
import { ClientesService } from 'src/app/services/clientes.service';
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

  constructor(public fb: FormBuilder, 
    private router: Router,
    private regionesService: RegionesService,
    public accountService: AccountService,
    private clientesService: ClientesService) { }

  ngOnInit(): void {
    
   this.mostrarPanelAdmin = this.accountService.usuario.rol === 'ADMINISTRADOR';
   //this.mostrarPanelCliente = this.accountService.usuario.rol === 'CORREDOR';

   if (this.mostrarPanelAdmin){
    
    this.clientesService.obtenerClientesAll().subscribe(({datos}: any) => {
      this.clientes = datos;
      this.formCliente.get('cliente')?.setValue("");
    });

   }else{

    this.clientesService.obtenerInfoClienteFromToken().subscribe(({datos}: any) => {

      let cliente = datos as ClienteWithCount;
      this.clienteSel = cliente;
      this.cargarInfoCupoCliente();
    })
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


onCambiarRegion(){

  const region = this.formCrear.get('region')?.value;

  //console.log('on CambiarRegion...', region);

  if(region !== ""){
    this.cargarComunas(region);
  }else{
    this.reiniciarComunas();
  }
}

onClienteChange() {
 // console.log('On cliente changed...')
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

  if(this.mostrarPanelCliente){
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

cargarInfoCupoCliente(){

  this.cupoDisponible = this.clienteSel!.cupoPropiedades - this.clienteSel!.cantidadPropiedades;

  let textoAux = this.mostrarPanelAdmin ? "Este cliente ha" : "Ha";
  let textoAuxDisp = this.cupoDisponible == 1 ? "propiedad" : "propiedades";

  

  if (this.cupoDisponible == 0){
    this.textoCupo = `${textoAux} utilizado ${ this.clienteSel!.cupoPropiedades} propiedades. Ha alcanzado el máximo de propiedades contratadas en este servicio.`;
  }else{
    this.textoCupo = `${textoAux} utilizado ${ this.clienteSel!.cantidadPropiedades} propiedes. Puede crear ${ this.cupoDisponible} ${textoAuxDisp} más.`;
  }
  
  this.mostrarInfoCupo = true;
 

}

}
