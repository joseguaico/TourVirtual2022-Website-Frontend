import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.css']
})
export class EditarDatosComponent implements OnInit {

  mostrarDetalle = true;
  editarPassword = false;

  formCrear: FormGroup = this.fb.group({
    'nombres': ['', [Validators.required] ,],
    'apellidos': ['', [Validators.required] ,],
    'password': ['', [Validators.required] ,]

  });

  constructor(public fb: FormBuilder, private router: Router, public usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.formCrear.get('nombres')?.setValue(this.usuarioService.usuario?.nombres);
    this.formCrear.get('apellidos')?.setValue(this.usuarioService.usuario?.apellidos);
  }

  mostrarPassChange(){
    this.editarPassword = !this.editarPassword;
  }

}
