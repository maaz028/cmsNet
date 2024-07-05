import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  email!: string;

  constructor(private auth: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.email = this.auth.getAccountDetails().email;
  }

  handleMobileMenu(element: HTMLDivElement): void {
    if (element.className.includes('show')) element.classList.remove('show');
    else element.classList.add('show');
  }

  signOut() {
    this.auth.clearCookies();
    this.router.navigateByUrl('/login');
  }
}
