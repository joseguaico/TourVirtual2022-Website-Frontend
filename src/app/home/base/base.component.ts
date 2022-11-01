import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

declare function initTemplate():void;
declare function initOffCanvas():void;
declare function initHoverableCollapse():void;

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  constructor(public usuarioService: UsuarioService) {
    document.querySelector('body')?.classList.remove('login-background');
   }

  ngOnInit(): void {
    document.querySelector('body')?.classList.remove('login-background');

    initTemplate();
    initHoverableCollapse();
    initOffCanvas();
  }

}
