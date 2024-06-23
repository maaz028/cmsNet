import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css'],
})
export class ExceptionsComponent {
  state: any;

  constructor(private router: Router) {
    this.state = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit() {
    if (this.state == undefined) {
      this.router.navigate(['/']);
    }
  }
}
