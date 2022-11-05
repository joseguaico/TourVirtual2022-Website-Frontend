import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  //public activo = false;
  //public menuStatus: string = this.menuService.menuStatus;
  public menuStatus: boolean = this.menuService.menuStatus !== '';

  constructor(public usuarioService: UsuarioService,
    public menuService: MenuService, 
    private router: Router
  ) { 
    this.menuService.reiniciarStatus();

  }

  ngOnInit(): void {
    //console.log('On Init Sidebar.');

    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.reiniciarStatus();
    this.menuService.cargarMenu();
  }

  salir(){
    this.usuarioService.logout();
  }

  reroute(url: string) {
    this.menuService.reiniciarStatus();
    //this.menuStatus = this.menuService.menuStatus;
    this.menuStatus = this.menuService.menuStatus !== '';
    this.router.navigate([url])
  }
  
  onNavbarToggleClick(){
    this.menuService.toggleStatus();
    //this.menuStatus = this.menuService.menuStatus;
    this.menuStatus = this.menuService.menuStatus !== '';
    //console.log('toggleClick: ', this.menuStatus);
  }

}
