import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  currentEmail!: string;

  ngOnInit(): void {
    this.currentEmail = this.auth.getAccountDetails().email;
  }

  async updateEmail(form: NgForm) {
    if (form.value.email !== this.currentEmail) {
      const updateEmail$ = this.auth.updateEmail(
        this.auth.getAccountDetails().id,
        form.value.email
      );

      await lastValueFrom(updateEmail$)
        .then((res) => {
          if (res) {
            this.toastr.success('Email Updated, Please Login again.');
            this.auth.clearCookies();
            this.router.navigateByUrl('/login');
          }
        })
    } else {
      this.toastr.warning('New email cannot be current email');
    }
  }

  async updatePassword(form: NgForm) {
    if (form.value.newPassword === form.value.confirmNewPassword) {
      const updatePassword$ = this.auth.updatePassword(
        this.auth.getAccountDetails().id,
        form.value.password,
        form.value.newPassword
      );

      await lastValueFrom(updatePassword$)
        .then((res: any) => {
          if (res.isPasswordUpdated) {
            this.toastr.success('Passwored updated, Please login again.');
            this.auth.clearCookies();
            this.router.navigateByUrl('/login');
          } else {
            this.toastr.error('Current Passwored is invalid.');
          }
        })
      form.reset();
    } else {
      this.toastr.error('Password do not match.');
    }
  }
}
