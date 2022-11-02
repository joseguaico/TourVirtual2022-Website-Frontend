import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {

  formCrear: FormGroup = this.fb.group({
    
  });

  constructor(public fb: FormBuilder, private router: Router) { }


  ngOnInit(): void {
  }

}
