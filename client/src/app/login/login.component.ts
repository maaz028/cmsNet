import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../models/account.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ExceptionsHandler } from '../services/exceptionHanlder';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _auth: AuthenticationService,
    private _cookie: CookieService,
    private _router: Router,
    private _exceptionHandelr: ExceptionsHandler
  ) {}

  ngOnInit(): void {
    if (!!this._cookie.get('token')) {
      this._router.navigate(['/dashboard']);
    }
  }

  resetInputs(form: NgForm) {
    form.reset();
  }

  login(form: NgForm) {
    const data: Account = {
      email: form.value.email,
      password: form.value.password,
    };

    this._spinner.show();

    this._auth.authenticateLogin(data).subscribe({
      next: (res) => {
     if (res?.invalidCredentials) {
          this._toastr.error('Invalid username or password');
        } else {
          this._auth.saveAccountDetails(res);
          this._auth.saveToken(res.token);
          this._router.navigate(['/dashboard']);
        }

        this._spinner.hide();
      },
      error: () => {
        this._toastr.error('Internal Server Error...');
        this._spinner.hide();
      },
    });
  }
}
