import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.class';
import { UsuariosService } from 'src/app/services/usuarios.service';

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

  usuarios: Usuario[] = [];
  private pageNumber: number = 1;
  private pageSize: number = 10;
  public cargando = false;
  public textoRespuestaBusqueda = '';

  constructor(public fb: FormBuilder, private router: Router,
    private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }

  buscarClick(){

    const { email, nombre, rol} = this.formBusqueda.value;

    this.usuariosService.obtenerUsuarios(email, nombre, rol, this.pageNumber, this.pageSize)
      .subscribe(({datos}: any) => {
        console.log("RESP: ", datos);
      }, (err) => {
        console.error(err);
      });
  }

  crearClick(){
    this.router.navigate(['usuarios/crear-usuario'])
  }

}
