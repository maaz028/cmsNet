import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export  class ExceptionsHandler {

  constructor(
    private _router: Router
  ){}

   handleException(state: any) {
    this._router.navigateByUrl('/exceptions', {
      state: state
    });
  }
}
