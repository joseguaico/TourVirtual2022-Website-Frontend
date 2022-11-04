import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

declare function initTemplate():void;
declare function initOffCanvas():void;
declare function initHoverableCollapse():void;
declare function toggleMenu():void;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  public classActive = '';

  constructor(public usuarioService: UsuarioService,
    public menuService: MenuService, 
    private router: Router,
  ) { }

  ngOnInit(): void {
    //console.log('On Init Sidebar.');

    document.querySelector('body')?.classList.remove('login-background');
    this.menuService.cargarMenu();
  }

  ngAfterViewInit(): void {
   // console.log('on AfterViewInit Sidebar. ');

    // this.toggleMenuService.toggleIconClicked.subscribe(data => {
      
    //   const antes = document.getElementById('sidebar')?.classList.value;
    //   console.log('antes', antes);

    //   this.toggleClasseActiva();

    //   const despues = document.getElementById('sidebar')?.classList.value;
    //   console.log('despues', despues);

    //   if (antes === despues){
    //     this.inicializarToggleMenuJS();
    //     //this.toggleClasseActiva();
    //     toggleMenu();
    //   }

    // });
    
  }

  ngOnDestroy(): void {
   // this.toggleMenuService.toggleIconClicked.unsubscribe();
  }

  toggleClasseActiva(){
    //console.log('ontoggle menu');

    if (this.classActive === ''){
      this.classActive = 'active';
      console.log('ActiveClass if', this.classActive)
    }else if(this.classActive === 'active'){
      this.classActive = '';  
      console.log('ActiveClass else', this.classActive)
    }
    
  }

  inicializarToggleMenuJS(){
    initTemplate();
    initOffCanvas();
    initHoverableCollapse();
  }


  salir(){
    this.usuarioService.logout();
  }

  reroute(url: string) {
    this.router.navigate([url])
  }

 
}
