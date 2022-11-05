import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { Subscription } from 'rxjs';
import { MenuService } from './services/menu.service';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TourVirtualWebApp';

  constructor(private storage: StorageService, private menuService: MenuService){
    this.menuService.reiniciarStatus();
    console.log('APP Component constructor...');
  }

  ngOnInit(): void {
    this.menuService.reiniciarStatus();
    console.log('APP Component onInit...');
  }

  ngOnDestroy(): void {
    this.storage.limpiarDatos();
  }

}
