import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @ViewChild('navbar') navbar!: ElementRef<any>;
  @ViewChild('hamburger') hamburger!: ElementRef<any>;

  constructor(private _category: CategoryService) {}

  categories$ = this._category.getCategories();

  handleMobileMenu(element: HTMLDivElement): void {
    if (element.className.includes('show')) element.classList.remove('show');
    else element.classList.add('show');
  }
  query = window.matchMedia('(max-width: 700px)');

  hideNav(navbar: HTMLElement) {

    if (this.query.matches) {
      navbar.classList.remove('show');
    }
  }

  ngAfterViewInit(): void {

    if (this.query.matches) {
      const navbar = this.navbar?.nativeElement;
      const hamburger = this.hamburger?.nativeElement;

      window.addEventListener('click', function (e) {
        navbar.contains(e.target) ||
        e.target == hamburger ||
        e.target == this.document.getElementById('hamButton')
          ? ''
          : navbar.classList.remove('show');
      });
    }
  }
}
