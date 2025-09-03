import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPolicyComponent } from './merchant-policy.component';

describe('MerchantPolicyComponent', () => {
  let component: MerchantPolicyComponent;
  let fixture: ComponentFixture<MerchantPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
