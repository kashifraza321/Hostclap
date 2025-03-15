import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewManagementProfileComponent } from './review-management-profile.component';

describe('ReviewManagementProfileComponent', () => {
  let component: ReviewManagementProfileComponent;
  let fixture: ComponentFixture<ReviewManagementProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewManagementProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewManagementProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
