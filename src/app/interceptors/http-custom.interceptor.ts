import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

import { StorageService } from '../services/storage.service';

const TOKEN_HEADER_KEY = 'Authorization';   

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {

  constructor(private storage: StorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let authRequest = request;
    const token = this.storage.getToken();

    if (token !== ''){
      authRequest = this.addTokenHeader(request, token);
    }

    //console.log('Custom interceptor. Token ', token);
    return next.handle(authRequest);
  }

  private addTokenHeader(request: HttpRequest<any>, token: string){
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler){
    
  }


}

export const AuthInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpCustomInterceptor, multi: true}
];


