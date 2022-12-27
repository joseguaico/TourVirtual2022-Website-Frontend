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

  public get menuStatus(){
    return this.storage.getMenuStatus();
  }

  constructor(private storage: StorageService){}
  
  cargarMenu(){
    this._menu = this.storage.getMenu();
  }

  toggleStatus(){
    //console.log('on cambiarStatus menu');

    const antes = this.storage.getMenuStatus();

    if (antes === ''){
      this.storage.guardarMenuStatus('active');
    }else{
      this.storage.guardarMenuStatus('');
    }

    const despues = this.storage.getMenuStatus();

    //console.log('Antes: ', antes, ", despues: ", despues);

    if (antes === despues){
      //console.log('no cambió');
    }
  }

  reiniciarStatus(){
    this.storage.guardarMenuStatus('');
  }

  seleccionarMenu(menuBase: string ){

   this.cargarMenu();
   //console.log('seleccionarMenu: ', menuBase);

   this._menu.forEach(f => {
      if (f.titulo.toLowerCase().indexOf(menuBase.toLowerCase()) > -1){
        f.selected = true;
      }else{
        f.selected = false;
      }
    });
    
    this.storage.guardarMenu(this._menu);

  }


}
