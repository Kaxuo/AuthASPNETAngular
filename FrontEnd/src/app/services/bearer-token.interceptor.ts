import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
import {LocalStorageService} from 'ngx-webstorage';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {

  constructor(private localStorageService : LocalStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization : `Bearer ${this.localStorageService.retrieve('token')}`
      }
    })
    return next.handle(request)
  }
}
