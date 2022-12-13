import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';
import { UsuarioAccount } from '../models/usuarioAccount.class';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private TOKEN_KEY = 'token';
  private REFRESH_TOKEN_KEY = 'refresh-token';
  private MENU_KEY = 'menu';
  private USUARIO_KEY = 'usuario';

  private MENU_STATUS = 'menu-status';

  constructor() { }

  public guardarToken(token: string){
    localStorage.setItem(this.TOKEN_KEY, '');
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public guardarRefreshToken(refreshToken: string){
    localStorage.setItem(this.REFRESH_TOKEN_KEY, '');
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public guardarMenu(menu: Menu[]){
    localStorage.setItem(this.MENU_KEY, '');
    localStorage.setItem(this.MENU_KEY, JSON.stringify(menu));
  }

  public guardarUsuario(usuario: UsuarioAccount){
    localStorage.setItem(this.USUARIO_KEY, '');
    localStorage.setItem(this.USUARIO_KEY, JSON.stringify(usuario));
  }

  public guardarDatos(token: string, refreshToken: string, menu: Menu[], usuario: UsuarioAccount){
    this.guardarToken(token);
    this.guardarRefreshToken(refreshToken);
    this.guardarMenu(menu);
    this.guardarUsuario(usuario);
  }

  public guardarMenuStatus(status: string){
    localStorage.setItem(this.MENU_STATUS, status);
  }

  public getToken(): string {
    let token = localStorage.getItem(this.TOKEN_KEY);
    return token ?? '';
  }

  public getRefreshToken(): string {
    let refresh = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return refresh ?? '';
  }

  public getMenu(): Menu[] {
    let menu = JSON.parse(localStorage.getItem(this.MENU_KEY)!);
    return menu ??  [];
  }

  public getUsuario(): UsuarioAccount | undefined {
    let usuario = JSON.parse(localStorage.getItem(this.USUARIO_KEY)!);
    return usuario;
  }

  public getMenuStatus(): string {
    let status = localStorage.getItem(this.MENU_STATUS);
    return status ??  '';
  }

  public limpiarDatos(){
    localStorage.clear();
  }





}
