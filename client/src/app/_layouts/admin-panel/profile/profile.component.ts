import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private _toastr: ToastrService,
    private _auth: AuthenticationService,
    private _spinner: NgxSpinnerService,
    private _router: Router
  ) {}

  currentEmail!: string;

  ngOnInit(): void {
    this.currentEmail = this._auth.getAccountDetails().email;
  }

  async updateEmail(form: NgForm) {
    if (form.value.email !== this.currentEmail) {
      const updateEmail$ = this._auth.updateEmail(
        this._auth.getAccountDetails().id,
        form.value.email
      );

      await lastValueFrom(updateEmail$)
        .then((res) => {
          if (res) {
            this._toastr.success('Email Updated, Please Login again.');
            this._auth.clearCookies();
            this._router.navigateByUrl('/login');
          }
        })
        .catch(() => {
          console.error('Server error ocurred.');
        });
    } else {
      this._toastr.warning('New email cannot be current email');
    }
  }

  async updatePassword(form: NgForm) {
    if (form.value.newPassword === form.value.confirmNewPassword) {
      const updatePassword$ = this._auth.updatePassword(
        this._auth.getAccountDetails().id,
        form.value.password,
        form.value.newPassword
      );

      await lastValueFrom(updatePassword$)
        .then((res: any) => {
          if (res.isPasswordUpdated) {
            this._toastr.success('Passwored updated, Please login again.');
            this._auth.clearCookies();
            this._router.navigateByUrl('/login');
          } else {
            this._toastr.error('Current Passwored is invalid.');
          }
        })
        .catch(() => {
          console.error('Server error ocurred.');
        });
      form.reset();
    } else {
      this._toastr.error('Password do not match.');
    }
  }
}
