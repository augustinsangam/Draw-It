import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLogicComponent } from './line-logic.component';

describe('LineLogicComponent', () => {
  let component: LineLogicComponent;
  let fixture: ComponentFixture<LineLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
