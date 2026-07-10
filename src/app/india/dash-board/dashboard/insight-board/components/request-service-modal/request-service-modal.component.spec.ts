import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestServiceModalComponent } from './request-service-modal.component';

describe('RequestServiceModalComponent', () => {
  let component: RequestServiceModalComponent;
  let fixture: ComponentFixture<RequestServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestServiceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
