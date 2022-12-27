import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-base-account',
  templateUrl: './base-account.component.html',
  styleUrls: ['./base-account.component.css']
})
export class BaseAccountComponent implements OnInit {

  constructor(private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.seleccionarMenu('editar datos de usuario');
  }
}
