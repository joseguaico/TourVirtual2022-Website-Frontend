import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  formCrear: FormGroup = this.fb.group({
 
  });

  constructor(public fb: FormBuilder, private router: Router) { }


  ngOnInit(): void {
  }

}
