import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHubComponent } from './my-hub.component';

describe('MyHubComponent', () => {
  let component: MyHubComponent;
  let fixture: ComponentFixture<MyHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
