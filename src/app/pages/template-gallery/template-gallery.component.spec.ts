import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateGalleryComponent } from './template-gallery.component';

describe('TemplateGalleryComponent', () => {
  let component: TemplateGalleryComponent;
  let fixture: ComponentFixture<TemplateGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
