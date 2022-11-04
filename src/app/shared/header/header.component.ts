import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';

import { UsuarioService } from 'src/app/services/usuario.service';

declare function initTemplate():void;
declare function initOffCanvas():void;
declare function initHoverableCollapse():void;

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(public usuarioService: UsuarioService) {
     }

  ngOnInit(): void {
    //console.log('OnHeader Init...');
    initTemplate();
    initOffCanvas();
    initHoverableCollapse();
  }

  ngAfterViewInit(): void {
    console.log('OnHeader after Init...');
    initTemplate();
    initOffCanvas();
    initHoverableCollapse();
  }


  onNavbarToggleClick(){
    console.log('ON NavbarToggle click');

    // let sidebar = document.getElementById('sidebar');

    // //console.log('sidebar', sidebar);

    // if (sidebar!.classList.contains('active')){
    //   sidebar!.classList.remove('active');
    //   console.log('remove class active')
    // }else{
    //   sidebar!.classList.add('active');
    //   console.log('add class active');
    // }

    // //this.toggleMenuService.toggleIconClicked.next('TOGGLE');
    // //toggleMenu();

    // console.log('sidebar despues ', $("#sidebar").toggleClass('active'));

  }

}
