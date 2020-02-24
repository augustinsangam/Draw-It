import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EraserLogicComponent } from './eraser-logic.component';

describe('EraserLogicComponent', () => {
  let component: EraserLogicComponent;
  let fixture: ComponentFixture<EraserLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
