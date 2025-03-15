import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedByComponent } from './reported-by.component';

describe('ReportedByComponent', () => {
  let component: ReportedByComponent;
  let fixture: ComponentFixture<ReportedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedByComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
