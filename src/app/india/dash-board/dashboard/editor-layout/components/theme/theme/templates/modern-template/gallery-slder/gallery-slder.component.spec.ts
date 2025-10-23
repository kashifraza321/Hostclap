import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySlderComponent } from './gallery-slder.component';

describe('GallerySlderComponent', () => {
  let component: GallerySlderComponent;
  let fixture: ComponentFixture<GallerySlderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GallerySlderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerySlderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
