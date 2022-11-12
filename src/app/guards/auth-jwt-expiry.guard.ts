import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom, Observable, tap } from 'rxjs';

import { StorageService } from '../services/storage.service';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthJwtExpiryGuard implements CanActivate, CanLoad {

  public jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private router: Router, 
    private accountService: AccountService,
    private storage: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    
    const token = this.storage.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    
    return this.accountService.refreshToken().pipe(

      tap((estaAutenticado: boolean) => {

        console.log('GUARD JWT canActivate ', estaAutenticado);

        if (!estaAutenticado){
          this.router.navigateByUrl('/auth/login');
        }

      })
    )
  }
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
   
    const token = this.storage.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    
    return this.accountService.refreshToken().pipe(

      tap((estaAutenticado: boolean) => {

        console.log('GUARD JWT canLoad ', estaAutenticado);

        if (!estaAutenticado){
          this.router.navigateByUrl('/auth/login');
        }

      })
    )


  }

  

}
