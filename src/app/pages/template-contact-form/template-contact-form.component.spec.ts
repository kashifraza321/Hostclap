import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateContactFormComponent } from './template-contact-form.component';

describe('TemplateContactFormComponent', () => {
  let component: TemplateContactFormComponent;
  let fixture: ComponentFixture<TemplateContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateContactFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
