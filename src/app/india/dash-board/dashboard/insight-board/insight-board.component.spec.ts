import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightBoardComponent } from './insight-board.component';

describe('InsightBoardComponent', () => {
  let component: InsightBoardComponent;
  let fixture: ComponentFixture<InsightBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
