import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRequestDetalModalComponent } from './booking-request-detal-modal.component';

describe('BookingRequestDetalModalComponent', () => {
  let component: BookingRequestDetalModalComponent;
  let fixture: ComponentFixture<BookingRequestDetalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRequestDetalModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRequestDetalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
