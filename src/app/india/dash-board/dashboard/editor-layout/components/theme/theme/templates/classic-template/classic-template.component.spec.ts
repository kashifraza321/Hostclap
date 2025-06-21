import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicTemplateComponent } from './classic-template.component';

describe('ClassicTemplateComponent', () => {
  let component: ClassicTemplateComponent;
  let fixture: ComponentFixture<ClassicTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassicTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
