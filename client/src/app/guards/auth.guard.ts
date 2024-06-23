3;

import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    public router: Router,
    private _authenticate: AuthenticationService,
    private _toastr: ToastrService
  ) {}

  canActivate(): boolean {
    if (this._authenticate.isLoggedIn()) {
      return true;
    } else {
      this._toastr.error('Please Login First.');
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
