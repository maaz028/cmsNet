import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private spinner: NgxSpinnerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.method === "POST" || request.method === "DELETE" || request.method === "PATCH") {
      this.spinner.show();
      return next.handle(request).pipe(
        delay(1000),
        finalize(() => this.spinner.hide())
      )
    }
    return next.handle(request).pipe(
      delay(1000)
    );
  }
}
