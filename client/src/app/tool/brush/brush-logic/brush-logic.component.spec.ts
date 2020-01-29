import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushLogicComponent } from './brush-logic.component';

describe('BrushLogicComponent', () => {
  let component: BrushLogicComponent;
  let fixture: ComponentFixture<BrushLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
