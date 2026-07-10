import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistSubGroupFormComponent } from './pricelist-sub-group-form.component';

describe('PricelistSubGroupFormComponent', () => {
  let component: PricelistSubGroupFormComponent;
  let fixture: ComponentFixture<PricelistSubGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricelistSubGroupFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricelistSubGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
