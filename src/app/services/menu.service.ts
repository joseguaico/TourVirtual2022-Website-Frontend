import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menu: Menu[] = [];
  
  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem("menu")!);
  }

}
