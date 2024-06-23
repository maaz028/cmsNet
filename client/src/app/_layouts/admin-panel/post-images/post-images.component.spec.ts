import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostImagesComponent } from './post-images.component';

describe('PostImagesComponent', () => {
  let component: PostImagesComponent;
  let fixture: ComponentFixture<PostImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostImagesComponent]
    });
    fixture = TestBed.createComponent(PostImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
