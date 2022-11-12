import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

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

  constructor(public fb: FormBuilder, private router: Router, public accountService: AccountService) { }

  ngOnInit(): void {

    this.formCrear.get('nombres')?.setValue(this.accountService.usuario?.nombres);
    this.formCrear.get('apellidos')?.setValue(this.accountService.usuario?.apellidos);
  }

  mostrarPassChange(){
    this.editarPassword = !this.editarPassword;
  }

}
