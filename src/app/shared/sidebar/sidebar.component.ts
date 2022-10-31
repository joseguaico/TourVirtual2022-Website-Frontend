import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public usuarioService: UsuarioService,
    public menuService: MenuService) { }

  ngOnInit(): void {
    this.menuService.cargarMenu();
  }

  salir(){
    this.usuarioService.logout();
  }

}
