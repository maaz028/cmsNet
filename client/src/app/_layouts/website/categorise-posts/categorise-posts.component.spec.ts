import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorisePostsComponent } from './categorise-posts.component';

describe('CategorisePostsComponent', () => {
  let component: CategorisePostsComponent;
  let fixture: ComponentFixture<CategorisePostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorisePostsComponent]
    });
    fixture = TestBed.createComponent(CategorisePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
