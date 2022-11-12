import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-propiedades',
  templateUrl: './base-propiedades.component.html',
  styleUrls: ['./base-propiedades.component.css']
})
export class BasePropiedadesComponent implements OnInit {

  constructor() {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
  }

}
