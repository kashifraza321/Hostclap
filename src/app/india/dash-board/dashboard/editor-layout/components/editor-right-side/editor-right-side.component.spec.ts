import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorRightSideComponent } from './editor-right-side.component';

describe('EditorRightSideComponent', () => {
  let component: EditorRightSideComponent;
  let fixture: ComponentFixture<EditorRightSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorRightSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorRightSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
