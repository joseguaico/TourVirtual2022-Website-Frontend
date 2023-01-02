import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';

import { StorageService } from '../services/storage.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';   

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private storage: StorageService, private accountService: AccountService,
    private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authRequest = request.clone({
    });
    const token = this.storage.getToken();

    if (token !== ''){
      authRequest = this.addTokenHeader(request, token);
    }

    //console.log('Custom interceptor. Token ', token);
    return next.handle(authRequest).pipe(

      catchError(error => {

        if (error instanceof HttpErrorResponse && !authRequest.url.includes('auth/login') && error.status === 401){
          return this.handle401Error(authRequest, next);
        }
        return throwError(error);
      })

    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string){

    let clonado = request.clone({ 
      headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
    
    return clonado;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler){
    
    if (!this.isRefreshing){
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.storage.getToken();

      if (token){

        return this.accountService.refreshToken().pipe(

          switchMap((resp: any) => {

            console.log("switchMap. RESP: ", resp);

            this.isRefreshing = false;
           
           this.refreshTokenSubject.next(this.storage.getToken());

            return next.handle(this.addTokenHeader(request, this.storage.getToken()));
          }),

          catchError((err) => {
            this.isRefreshing = false;
           
            this.storage.limpiarDatos();
            this.router.navigateByUrl('/auth/login');
            return throwError(err);

          })

        );

      }

    }


    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }


}

export const AuthInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true}
];


