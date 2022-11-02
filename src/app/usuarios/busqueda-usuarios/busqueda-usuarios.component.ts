import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-usuarios',
  templateUrl: './busqueda-usuarios.component.html',
  styleUrls: ['./busqueda-usuarios.component.css']
})
export class BusquedaUsuariosComponent implements OnInit {

  formBusqueda: FormGroup = this.fb.group({
    email: ['',],
    nombre: ['',],
    rol: ['',]
  });

  constructor(public fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  buscarClick(){

  }

  crearClick(){
    this.router.navigate(['usuarios/crear-usuario'])
  }

}
