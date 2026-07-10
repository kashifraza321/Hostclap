import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAmenitiesComponent } from './template-amenities.component';

describe('TemplateAmenitiesComponent', () => {
  let component: TemplateAmenitiesComponent;
  let fixture: ComponentFixture<TemplateAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateAmenitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
