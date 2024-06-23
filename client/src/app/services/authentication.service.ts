import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cmsEnv } from 'src/environments/environment.development';
import { Account } from '../models/account.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private _http: HttpClient, private _cookie: CookieService) {}

  isLoggedIn(): boolean {
    return !!this._cookie.get('token');
  }

  saveAccountDetails(account: Account) {
    this._cookie.set('accountDetails', JSON.stringify(account));
  }

  getAccountDetails(): Account {
    return JSON.parse(this._cookie.get('accountDetails'));
  }

  saveToken(token?: string) {
    this._cookie.set('token', token ? token : '');
  }

  getToken() {
    return this._cookie.get('token');
  }

  clearCookies() {
    this._cookie.deleteAll('../');
  }

  authenticateLogin(data: Account): Observable<Account> {
    return this._http.post<Account>(
      `${cmsEnv.baseUrl}/Account/AuthenticateLogin`,
      data
    );
  }

  updateEmail<T>(id: T, email: string): Observable<Account> {
    return this._http.patch<Account>(`${cmsEnv.baseUrl}/Account/UpdateEmail`, {
      id: id,
      email: email,
      password: (Math.random() + 1).toString(36).substring(7),
    });
  }

  updatePassword<T>(
    id: T,
    password: string,
    newPassword: String
  ): Observable<object> {
    return this._http.patch<object>(
      `${cmsEnv.baseUrl}/Account/UpdatePassword`,
      {
        id: id,
        email: (Math.random() + 1).toString(36).substring(7) + '@gmail.com',
        password: password,
        newPassword: newPassword,
      }
    );
  }
}
