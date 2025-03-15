import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminManagementListComponent } from './subadmin-management-list.component';

describe('SubadminManagementListComponent', () => {
  let component: SubadminManagementListComponent;
  let fixture: ComponentFixture<SubadminManagementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubadminManagementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubadminManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
