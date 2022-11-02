import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  formCrear: FormGroup = this.fb.group({
  
  });

  constructor(public fb: FormBuilder, private router: Router) { }


  ngOnInit(): void {
  }

}
