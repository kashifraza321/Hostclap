import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgroupDetailComponent } from './subgroup-detail.component';

describe('SubgroupDetailComponent', () => {
  let component: SubgroupDetailComponent;
  let fixture: ComponentFixture<SubgroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubgroupDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubgroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
