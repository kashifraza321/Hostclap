import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProFeaturesComponent } from './pro-features.component';

describe('ProFeaturesComponent', () => {
  let component: ProFeaturesComponent;
  let fixture: ComponentFixture<ProFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
