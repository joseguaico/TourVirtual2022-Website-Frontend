import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-usuarios',
  templateUrl: './base-usuarios.component.html',
  styleUrls: ['./base-usuarios.component.css']
})
export class BaseUsuariosComponent implements OnInit {

  constructor() {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
  }

}
