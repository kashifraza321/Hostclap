import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsSliderComponent } from './about-us-slider.component';

describe('AboutUsSliderComponent', () => {
  let component: AboutUsSliderComponent;
  let fixture: ComponentFixture<AboutUsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
