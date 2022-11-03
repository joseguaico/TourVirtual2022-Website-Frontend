import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { TipoServicio } from 'src/app/interfaces/tipoServicio.interfaces';
import { ClientesService } from 'src/app/services/clientes.service';
import { TiposServicioService } from 'src/app/services/tipos-servicio.service';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {

  public clientes: Cliente[] = [];
  public tiposServicio: TipoServicio[] = [];


  formCrear: FormGroup = this.fb.group({
    cliente: ['', [Validators.required] ],
    cantidadPropiedades: ['', [Validators.required] ],
    cantidadFotos: ['', [Validators.required] ],
    tipoServicio: ['', [Validators.required] ],
    montoVenta: ['', [Validators.required] ],
  });

  constructor(public fb: FormBuilder, 
    private router: Router, 
    private clientesService: ClientesService,
    private tiposServicioService: TiposServicioService) { }

  ngOnInit(): void {
    this.clientesService.obtenerClientes().subscribe(({datos}: any) => {
      this.clientes = datos;
    });

    this.tiposServicio = this.tiposServicioService.obtenerTiposServicio();
  }



  campoNoValido(campo: string){
    return this.formCrear.controls[campo].errors && this.formCrear.controls[campo].touched;
  }

  guardar(){
    if (this.formCrear.invalid){
      return this.formCrear.markAllAsTouched();
    }    
  }


}
