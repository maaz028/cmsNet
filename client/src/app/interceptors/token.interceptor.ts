import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _auth: AuthenticationService,
    private _toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this._auth.getToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigateByUrl('/login');
            this._toastr.warning(
              'Session Expired. Please Login again.',
              'Warning'
            );
          }
          else if (err.status === 500) {
            err.error.exceptions.fromComponent = this._router.url;
            this._router.navigateByUrl('/exceptions', {
              state: err.error.exceptions
            });

          }
        }

        this._auth.clearCookies();
        return throwError(() => {
          new Error('Server error ocurred. Please login again');
        });
      })
    );
  }
}
