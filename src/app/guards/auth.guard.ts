import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService: UsuarioService,
    private router: Router){}


  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    
    return this.usuarioService.validarToken().pipe(

      tap((estaAutenticado: boolean) => {

       // console.log('GUARD canActivate ', estaAutenticado);

        if (!estaAutenticado){
          this.router.navigateByUrl('/auth/login');
        }

      })
    )


  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.usuarioService.validarToken().pipe(
      tap((estaAutenticado: boolean) => {

        //console.log('GUARD canLoad ', estaAutenticado);

        if (!estaAutenticado){
          this.router.navigateByUrl('/auth/login');
        }
      })
    )
  }
}
