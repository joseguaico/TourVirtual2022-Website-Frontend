import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private _menu: Menu[] = [];

  public get menu(){
    return this._menu;
  }


  constructor(private storage: StorageService){}
  
  cargarMenu(){
    this._menu = this.storage.getMenu();
  }

}
