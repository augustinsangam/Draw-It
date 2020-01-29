import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorLogicComponent } from './color-logic.component';

describe('ColorLogicComponent', () => {
  let component: ColorLogicComponent;
  let fixture: ComponentFixture<ColorLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
