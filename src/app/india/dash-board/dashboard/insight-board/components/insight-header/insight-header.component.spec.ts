import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightHeaderComponent } from './insight-header.component';

describe('InsightHeaderComponent', () => {
  let component: InsightHeaderComponent;
  let fixture: ComponentFixture<InsightHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
