import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-base-clientes',
  templateUrl: './base-clientes.component.html',
  styleUrls: ['./base-clientes.component.css']
})
export class BaseClientesComponent implements OnInit {

  constructor(private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.seleccionarMenu('clientes');
  }

}
