import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubgroupFormComponent } from './add-subgroup-form.component';

describe('AddSubgroupFormComponent', () => {
  let component: AddSubgroupFormComponent;
  let fixture: ComponentFixture<AddSubgroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubgroupFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubgroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
