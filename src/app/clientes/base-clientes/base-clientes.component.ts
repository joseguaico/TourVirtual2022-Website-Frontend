import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-clientes',
  templateUrl: './base-clientes.component.html',
  styleUrls: ['./base-clientes.component.css']
})
export class BaseClientesComponent implements OnInit {

  constructor() {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
  }

}
