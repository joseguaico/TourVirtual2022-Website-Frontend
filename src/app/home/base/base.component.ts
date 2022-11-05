import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

// declare function initTemplate():void;
// declare function initOffCanvas():void;
// declare function initHoverableCollapse():void;

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  constructor(public usuarioService: UsuarioService,
    private menuService: MenuService) {
    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.reiniciarStatus();
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');

    // initTemplate();
    // initHoverableCollapse();
    // initOffCanvas();
  }

}
