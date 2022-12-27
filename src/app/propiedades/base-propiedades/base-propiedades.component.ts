import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-base-propiedades',
  templateUrl: './base-propiedades.component.html',
  styleUrls: ['./base-propiedades.component.css']
})
export class BasePropiedadesComponent implements OnInit {

  constructor(private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.seleccionarMenu('propiedades');
  }

}
