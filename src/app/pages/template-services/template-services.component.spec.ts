import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateServicesComponent } from './template-services.component';

describe('TemplateServicesComponent', () => {
  let component: TemplateServicesComponent;
  let fixture: ComponentFixture<TemplateServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
