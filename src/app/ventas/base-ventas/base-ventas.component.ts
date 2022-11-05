import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

// declare function initTemplate():void;
// declare function initOffCanvas():void;
// declare function initHoverableCollapse():void;

@Component({
  selector: 'app-base-ventas',
  templateUrl: './base-ventas.component.html',
  styleUrls: ['./base-ventas.component.css']
})
export class BaseVentasComponent implements OnInit {

  constructor(public usuarioService: UsuarioService,
    private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.reiniciarStatus();
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');
    // initTemplate();
    // initOffCanvas();
    // initHoverableCollapse();
  }

}
