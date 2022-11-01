import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menu: Menu[] = [];

  constructor(private storage: StorageService){}
  
  cargarMenu(){
    this.menu = this.storage.getMenu();
  }

}
