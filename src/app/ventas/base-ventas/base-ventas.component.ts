import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-base-ventas',
  templateUrl: './base-ventas.component.html',
  styleUrls: ['./base-ventas.component.css']
})
export class BaseVentasComponent implements OnInit {

  constructor(private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.seleccionarMenu('ventas');
  }

}
