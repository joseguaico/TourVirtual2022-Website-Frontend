import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-propiedad',
  templateUrl: './crear-propiedad.component.html',
  styleUrls: ['./crear-propiedad.component.css']
})
export class CrearPropiedadComponent implements OnInit {

  mostrarPanelAdmin = false;
  mostrarPanelCliente = true;
  cupoDisponible: number = 5;

  formCrear: FormGroup = this.fb.group({
  
  });

  constructor(public fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

}
