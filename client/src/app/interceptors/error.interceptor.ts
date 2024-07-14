import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.toastr.error(err.message, err.status.toString());
          }
          else if (err.status === 404) {
            this.toastr.error('Resource not found',err.status.toString());
          }
           else if (err.status === 500) {
            err.error.exceptions.fromComponent = this.router.url;
            this.router.navigateByUrl('/exceptions', {
              state: err.error.exceptions,
            });
          } else {
            this.toastr.error('Server Error Ocurred.','500');
          }
        }

        return throwError(() => err);
      })
    );
  }
}
