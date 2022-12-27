import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-base-usuarios',
  templateUrl: './base-usuarios.component.html',
  styleUrls: ['./base-usuarios.component.css']
})
export class BaseUsuariosComponent implements OnInit {

  constructor(private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.seleccionarMenu('usuarios');
  }

}
